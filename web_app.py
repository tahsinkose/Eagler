import os
from flask import Flask,send_file,jsonify,request,render_template,redirect,url_for
import pymongo
import hashlib,base64
import datetime
from threading import Lock

mutex = Lock()

client = pymongo.MongoClient('localhost:27017')
db = client.angular_flask_db

app = Flask(__name__)

@app.route("/")
def index():
	return send_file("templates/index.html") 



@app.route("/signUp",methods=['POST'])
def signup():
	try:
		result = request.get_json()
	
		hash_data = result['hash']
	
		salt = result['salt']
		email = result['email']
		username = result['username']
		name = result['name']
		surname = result['surname']
		db.userData.insert_one({
			'email':email, 'hash':hash_data, 'salt':salt, 'username': username, 'name': name, 'surname': surname
		})
		return jsonify(status='OK',message='inserted successfully')
	except pymongo.errors.DuplicateKeyError:
		return jsonify(status='ERROR',message="duplicate")

"""Login method. Checks the hash and salt created at registration. If both matches, then login would be successful."""
@app.route("/login",methods=['POST'])
def login():
	result = request.get_json()
	print("CLIENT ADDRESS: " + request.remote_addr)
	email = result['email']
	password = result['password']
	isRegistered = db.userData.find_one({"email":email})
	if not isRegistered:
		return jsonify(status='NOT_EXISTS', message='Email is not registered')
	salt = isRegistered['salt']
	hash_val = isRegistered['hash']
	check_hash = hashlib.sha256(salt + password).hexdigest()
	if(check_hash == hash_val):
		username = isRegistered['username']
		db.userData.update_one({"username":username},{'$set' : {'currentIP':request.remote_addr}})
		return jsonify(status='OK',message=username)
	else:
		return jsonify(status='WRONG',message='Password incorrect')

"""Logout method. Clears the stored IPs at exit."""
@app.route("/logout",methods=['POST'])
def logout():
	result = request.get_json()
	username = result['user']
	db.userData.update_one({"username":username},{'$unset' : {'currentIP':""}})
	return jsonify(status='OK')

# Check whether the user exists in case of direct link access.
@app.route("/doesExist",methods=['POST'])
def check_user():
	result = request.get_json()
	username = result['user']
	doesExist = db.userData.find_one({"username":username})
	if not doesExist:
		return jsonify(status='404', message='Does not exists')
	return jsonify(status='OK', message='User exists')

# Check whether the user logged in legally (again in case of direct link access.)
@app.route("/validLogin",methods=['POST'])
def valid_login():
	try:
		result = request.get_json()
		username = result['user']
		query = db.userData.find_one({"username":username},{"currentIP":"1","_id":0})
		loginValid = query['currentIP']
		return jsonify(status='OK', message='Legal routing')	
	except:
		return jsonify(status='405', message='Illegal routing')

"""Sends mail. This is the most loaded operation in the application, since it requires 2 searches and 2 updates for the receiver and sender. """ 

@app.route("/send_mail",methods=['POST'])
def handle_mail():
	result = request.get_json()
	from_username = result['from']
	to = result['to']
	doesExist = db.userData.find_one({"email":to})
	sender = db.userData.find_one({"username":from_username})
	from_email = sender['email']

	if not doesExist:
		return jsonify(status='NOT_EXISTS', message='Email is not registered')
	subject = result['subject']
	mail = result['mail']
	date = str(datetime.date.today())
	db.userData.update_one({"email":from_email},{'$push' : { 'Outbox': {'to':to, 'subject':subject, 'mail':mail, 'date':date }}})
	db.userData.update_one({"email":to},{'$push' : { 'Inbox': {'from':from_email, 'subject':subject, 'mail':mail,'date':date }}})
	return jsonify(status='OK', message='Mail is sent successfully.')


@app.route("/save_draft",methods=['POST'])
def save_draft():
	result = request.get_json()
	from_username = result['from']
	to = result['to']
	subject = result['subject']
	mail = result['mail']
	date = str(datetime.date.today())
	db.userData.update_one({"username":from_username},{'$push' : { 'Drafts': {'to':to, 'subject':subject, 'mail':mail,'date': date}}})
	return jsonify(status='OK') 


@app.route("/delete",methods=['POST'])
def delete():
	result = request.get_json()
	from_username = result['from']
	index = result['index']
	box = result['folder']
	folder = box[:1].upper() + box[1:]
	if folder == "Draft":
		folder = "Drafts"
	mutex.acquire()
	db.userData.update_one({"username":from_username},{'$unset' : { folder+'.'+str(index): "1"}})
	db.userData.update_one({"username":from_username},{'$pull' : { folder : None}})
	mutex.release()
	return jsonify(status='OK')	
	

# Fetcher routines. Self explanatory from their corresponding names.
"""Fetches outbox."""
@app.route("/fetch_outbox",methods=['POST'])
def fetch_outbox():
	result = request.get_json()
	username = result['user']

	outbox = db.userData.find_one ({"username":username},{"Outbox":1,"_id":0})
	
	return jsonify(outbox)

"""Fetches inbox."""
@app.route("/fetch_inbox",methods=['POST'])
def fetch_inbox():
	result = request.get_json()
	username = result['user']

	inbox = db.userData.find_one ({"username":username},{"Inbox":"1","_id":0})
	
	return jsonify(inbox)
		
"""Fetches draft."""
@app.route("/fetch_draft",methods=['POST'])
def fetch_draft():
	result = request.get_json()
	username = result['user']

	draft = db.userData.find_one ({"username":username},{"Drafts":"1","_id":0})
	
	return jsonify(draft)



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8090))
    app.run(host='0.0.0.0', port=port)
