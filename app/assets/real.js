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
	var contacts = Ti.Contacts.getAllPeople();
	
	Titanium.API.info('Contacts : ' + contacts);
	
	Titanium.API.info('Contacts JSON : ' + JSON.stringify(contacts));

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
		Titanium.API.info("The Email String : " + contacts[i].image);

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
			image : contacts[i].image
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
		var imgPicright = Titanium.UI.createImageView({
			top : 10,
			right : 20,
			height : 46,
			width : 50,
			borderRadius : 15,
			//image : '/Message_DSE.png',
			custID : 'right',
			emailaddress : (emailStrin) ? emailStrin : ''
		});

		var db = Titanium.Database.install('/em.db', 'em');

		var rows = db.execute("SELECT * FROM emailData");

		if (rows.isValidRow()) {
			Titanium.API.info("========= DATABSE ===========" + rows.fieldByName('emailAddress'));
			if ((rows.fieldByName('emailAddress')) == emailStrin) {
				imgPicright.image = '/Message_SE.png';
			} else {
				imgPicright.image = '/Message_DSE.png';
			}
			rows.next();
		} else {
			imgPicright.image = '/Message_DSE.png';
		}
		rows.close();
		db.close();

		row_person.add(imgPicleft);
		row_person.add(lblname);
		row_person.add(lblEmail);
		row_person.add(imgPicright);
		data.push(row_person);
	}
	tableView.setData(data);
};

tableView.addEventListener('click', function(e) {
	var em = null;
	if (e.source.custID == 'right') {
		if (e.source.emailaddress !== '') {
			Titanium.API.info("emailaddress:" + e.source.emailaddress);
			em = e.source.emailaddress;
			if (Titanium.Network.online) {
				var emailDialog = Titanium.UI.createEmailDialog({
					barColor : (Titanium.Platform.osname != 'android') ? "black" : ""
				});
				if (!emailDialog.isSupported()) {
					alert('Please configure your email account.');
					return;
				}
				emailDialog.addEventListener('complete', function(e) {
					if (e.success && e.result == emailDialog.SENT) {
						if (Titanium.Platform.osname != 'android') {
							var db = Titanium.Database.install('/em.db', 'em');
							Titanium.API.info("emailaddress:" + em);
							db.execute('INSERT INTO emailData(emailAddress)VALUES(?)', em);
							db.close();
							alert("Email sent successfully.");
						}
					} else if (e.result == emailDialog.FAILED) {
						alert("Email was not sent.Please try again.");

					} else if (e.result == emailDialog.CANCELLED) {

					}
				});
				emailDialog.toRecipients = ['jnj.idr@gmail.com'];
				emailDialog.open();
			} else {
				alert("Please turn on internet connection.");
			}
		} else {
			alert('No email address found.');
		}
	}
});
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
