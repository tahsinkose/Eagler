import os
from flask import Flask,send_file,jsonify,request,abort
import pymongo
import hashlib,base64

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


@app.route("/login",methods=['POST'])
def login():
	result = request.get_json()
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
		return jsonify(status='OK',message=username)
	else:
		return jsonify(status='WRONG',message='Password incorrect')


@app.route("send_mail",methods=['POST'])
def send_mail():
	result = request.get_json()
	to = result['to']
	

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8149))
    app.run(host='0.0.0.0', port=port)
