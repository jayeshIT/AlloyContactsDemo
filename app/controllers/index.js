var addressBookDisallowed = function() {
	alert("Sorry!!!....you can not Access Address book.");
};
/*
 var performAddressBookFunction = function() {
 var singleValue = ['recordId', 'firstName', 'middleName', 'lastName', 'fullName', 'prefix', 'suffix', 'nickname', 'firstPhonetic', 'middlePhonetic', 'lastPhonetic', 'organization', 'jobTitle', 'department', 'note', 'birthday', 'created', 'modified', 'kind'];
 var multiValue = ['email', 'address', 'phone', 'instantMessage', 'relatedNames', 'date', 'url'];

 var singleValue = ['fullName'];
 var multiValue = ['email'];

 var people = Titanium.Contacts.getAllPeople();
 Ti.API.info('Total contacts: ' + people.length);

 for (var i = 0, ilen = people.length; i < ilen; i++) {
 Ti.API.info('---------------------');
 var person = people[i];
 for (var j = 0, jlen = singleValue.length; j < jlen; j++) {
 Ti.API.info(singleValue[j] + ': ' + person[singleValue[j]]);
 }
 for (var j = 0, jlen = multiValue.length; j < jlen; j++) {
 //Ti.API.info('work' + ': ' + JSON.stringify(person[multiValue[j]].work));
 if (JSON.stringify(person[multiValue[j]].work) != undefined) {
 var am = JSON.stringify(person[multiValue[j]].work.toString()).split(",");
 Ti.API.info('work am' + ': ' + am[0]);
 }
 //Ti.API.info('home' + ': ' + JSON.stringify(person[multiValue[j]].home));
 if (JSON.stringify(person[multiValue[j]].home) != undefined) {
 var jay = JSON.stringify(person[multiValue[j]].home.toString()).split(",");
 Ti.API.info('work jay' + ': ' + jay[0]);
 }
 }
 }
 };
 */

var tableView = Titanium.UI.createTableView({
	top : 0,
	left : 0,
	right : 0,
	separatorColor : '#E5E5E5',
	separatorStyle : 1,
	backgroundColor : 'white',
	footerTitle : ''
});
var data = [];

var getAllContacts = function() {
	data = [];
	try {
		var contacts = Ti.Contacts.getAllPeople();

		Titanium.API.info('Contacts : ' + contacts);

		Titanium.API.info('Contacts JSON : ' + JSON.stringify(contacts));

		var db = Titanium.Database.install('/contacts.db', 'contacts');

		for (var i = 0; i < contacts.length; i++) {

			var personname = contacts[i].fullName;

			if (!personname || personname.length === 0) {
				personname = "(no name)";

			}
			var emailStrin = null;

			Titanium.API.info("The USER EMail:" + JSON.stringify(contacts[i].email));
			Titanium.API.info("THE NAME:");

			var JsEmail = contacts[i].email;

			if (JsEmail.hasOwnProperty('work')) {

				emailStrin = JsEmail.work[0];
			}
			if (JsEmail.hasOwnProperty('home')) {

				emailStrin = JsEmail.home[0];
			}
			Titanium.API.info("The Email String : " + emailStrin);

			if (contacts[i].image) {
				var img = contacts[i].image;
			} else {
				var img = null;
			}
			Titanium.API.info("The Image : " + img);

			var row_person = Ti.UI.createTableViewRow({
				personname : personname,
				height : 70,
				selectedBackgroundColor : 'transparent'
			});

			var imgPicleft = Titanium.UI.createImageView({
				top : 10,
				left : 15,
				height : 30,
				width : 30,
				borderRadius : 15,
				image : img
			});
			var lblname = Titanium.UI.createLabel({
				top : 10,
				height : 20,

				left : 60,
				right : 0,
				textAlign : 'left',
				font : {
					fontSize : 16
				},
				color : 'black',
				text : personname
			});
			var lblEmail = Titanium.UI.createLabel({
				top : 40,
				height : 20,
				left : 60,
				right : 0,
				textAlign : 'left',
				font : {
					fontSize : 12,
					fontWeight : 'bold'
				},
				color : 'black',
				text : emailStrin
			});
			db.execute('INSERT into peoples(email,name,leftpic)VALUES(?,?,?)', emailStrin, personname, emailStrin);
			row_person.add(imgPicleft);
			row_person.add(lblname);
			row_person.add(lblEmail);
			data.push(row_person);
		}
		db.close();
		tableView.setData(data);
	} catch(ex) {
		Ti.API.info('-----Ex:' + ex);
	}
};

if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED) {
	getAllContacts();
} else {
	Ti.Contacts.requestAuthorization(function(e) {
		if (e.success) {
			getAllContacts();
		} else {

		}
	});
}
$.index.add(tableView);

$.index.open();
