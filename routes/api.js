var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var dbconfig = require('../database.js');
var conn = mysql.createConnection(dbconfig);
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '111111',
	database: 'sejongTrack'
};
router.use(session({
	secret: '12sdfwerwersdfserwerwef', //keboard cat (랜덤한 값)
	resave: false,
	saveUninitialized: true,
	store: new MySQLStore(options)
}));

router.get('/student/:id', function(req, res, next) {
  var student_id = req.params.id;
  console.log(student_id)

  var sql = "SELECT * FROM student WHERE student_number=?";

  conn.query(sql, [student_id], function(error, results, fields) {
    if (error) {
      console.log(error);
      res.send('fail');
    } else {
      var user = results[0];
      console.log(user)
      res.send(user)
    }
  });

});
router.get('/student/:id/trackInfo', function(req, res, next) {
  var student_id = req.params.id;
  console.log(student_id)
  res.send(JSON.stringify({'가상현실' : 7, '인공지능' : 3 , '응용SW':5, 'HCI&VC':2, '멀티미디어':4, '사물인터넷':1, '시스템응용':2, '지능형인지':7, '데이터사이언스':3, '정보보호':2}));
  /*
  var sql = "SELECT * FROM track";

  conn.query(sql, [student_id], function(error, results, fields) {
    if (error) {
      console.log(error);
      res.send('fail');
    } else {
      var user = results[0];
      console.log(user)
      res.send(user)
    }
  });
  */
});
router.get('/student/:id/favorTracks', function(req, res, next) {
	var student_id = req.params.id;
  var sql = "SELECT * FROM `favorTrack` WHERE `student_id`=?";

  conn.query(sql, [student_id ], function(error, results, fields) {
    if (error) {
      console.log(error);
      res.send('fail');
    } else {
      var tracks = results;
      res.send(tracks)
    }
  });
});
router.get('/tracks', function(req, res, next) {
  var sql = "SELECT * FROM track";

  conn.query(sql, function(error, results, fields) {
    if (error) {
      console.log(error);
      res.send('fail');
    } else {
      var tracks = results;
      res.send(tracks)
    }
  });
});
router.get('/lectures', function(req, res, next) {
  var sql = "SELECT * FROM `lecture`;";

  conn.query(sql, function(error, results, fields) {
    if (error) {
      console.log(error);
      res.send('fail');
    } else {
      var lectures = results;
      res.send(lectures)
    }
  });
});
router.get('/student/:id/lectures', function(req, res, next) {
	var student_id = req.params.id;
  var sql = "SELECT u.student_id, u.lecture_id, p.lecture_name FROM lecture AS p INNER JOIN takenLecture AS u ON u.lecture_id = p.lecture_id WHERE u.student_id=?";

  conn.query(sql, [student_id ], function(error, results, fields) {
    if (error) {
      console.log(error);
      res.send('fail');
    } else {
      var tracks = results;
      res.send(tracks)
    }
  });
});
router.get('/lectureTrack', function(req, res, next) {
  var sql = "SELECT u.lecture_name, p.lecture_id, p.track_id FROM lecture AS u INNER JOIN lectureTrack AS p ON u.lecture_id = p.lecture_id ;";

  conn.query(sql,function(error, results, fields) {
    if (error) {
      console.log(error);
      res.send('fail');
    } else {
      var tracks = results;
      res.send(tracks)
    }
  });
});
router.get('/lecture/:id/track', function(req, res, next) {
	var lecture_id = req.params.id;
	var sql = "SELECT u.lecture_name, p.lecture_id, p.track_id FROM lecture AS u INNER JOIN lectureTrack AS p ON u.lecture_id = p.lecture_id WHERE p.lecture_id=?;";

	conn.query(sql,[ lecture_id],function(error, results, fields) {
		if (error) {
			console.log(error);
			res.send('fail');
		} else {
			res.send(results)
		}
	});
});
router.get('/student/:id/trackcount', function(req, res, next) {
	var trackArray = ["가상현실","인공지능","응용SW","HCI&VC","멀티미디어" ,"사물인터넷",
	"시스템응용", "지능형인지", "데이터사이언스", "정보보호"];
	var student_id = req.params.id;
	var trackCnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
	var sql = "SELECT u.student_id, u.lecture_id, p.lecture_name FROM lecture AS p INNER JOIN takenLecture AS u ON u.lecture_id = p.lecture_id WHERE u.student_id=?";

	conn.query(sql, [student_id ], function(error, results, fields) {
		if (error) {
			console.log(error);
			res.send('fail');
		} else {

			for(var i=0; i<results.length; i++){
				var lectureId = results[i].lecture_id;
				//console.log(results[i].lecture_id)
				var sql = "SELECT u.lecture_name, p.lecture_id, p.track_id FROM lecture AS u INNER JOIN lectureTrack AS p ON u.lecture_id = p.lecture_id WHERE p.lecture_id=?;";

			  conn.query(sql,[ lectureId],function(error, results, fields) {
			    if (error) {
			      console.log(error);
			      res.send('fail');
			    } else {
						for(var i=0; i<results.length; i++){
							var trackId = results[i].track_id;
							trackCnt[trackId-1] = trackCnt[trackId-1]+1;
							console.log(trackCnt[trackId-1])
						}

			    }
			  });
			}//for
		}
	});

});
module.exports = router;
