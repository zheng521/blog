module.exports=function(app){
	// var router = require('express').Router();
   	 var AV = require('leanengine');
   	 var Todo = AV.Object.extend('TestObject');
//主页
	app.get('/', function(req, res, next) {
		
	  var query = new AV.Query(Todo);
	  query.descending('createdAt');  
	 
	  query.find({
	    success: function(results) {
	      res.render('index', {
	        todos: results,
	        uname:req.session.uname

	      });
	       
	    },
	    error: function(err) {
	      if (err.code === 101) {
	        // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
	        // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
	        res.render('index', {
	          todos: []
	        });
	      } else {
	        next(err);
	      }
	    }
	  });
	});
	
//发表
	app.get('/u/:findId',function(req,res){
		var query = new AV.Query(Todo);
		query.descending('createdAt');
		query.equalTo("findId",req.params.findId);
		query.find({
		  success: function(results) {
		    res.render('detail', {
	          todos: results,
	          uname:req.session.uname
	         });
			   
		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
		  }
		});
		
	});
	
  app.get('/publish',function(req,res){
  	res.render('publish', {
	          uname:req.session.uname
        });
  });
  app.post('/publish',function(req,res){
  	var query = new AV.Query(Todo);
  	var uname = req.body.username;
  	var pws = req.body.password;
		query.descending('createdAt');
		query.equalTo("userName",uname);
		query.find({
		   success: function(results) {
		  	var findId = (results.length).toString();
		  	var post = new Todo();
		  	var title = req.body.title;
		  	var content = req.body.content;
		  	post.set("findId",findId); 
		  	post.set("title",title);
		  	post.set("content",content);
		  	post.save(null,{
		  		success: function(post){
		  			res.redirect('/');
		  		},
		  		error:function(post,error){
		  			console.log('Failed to create new object, with error message: ' + error.message)
		  		}
		  	});
		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
		  }
		});	
  	
  });
//登录  
app.post('/login',function(req,res){
  	var admin = AV.Object.extend('admin');
  	var query = new AV.Query(admin);
  	var uname = req.body.username;
  	var pws = req.body.password;
		query.descending('createdAt');
		query.equalTo("userName",uname);
		query.find({
		  success: function(results) {
		  	if(results.length == 0){
		  		return res.redirect('/login');
		  	}else{
		  		for (var i = 0; i < results.length; i++) {
			      var object = results[i];
			      if(pws == object.get('password')){
			        req.session.uname = object.get('userName');
			      	res.redirect('/');
			      }
			    }
		  	}	   
		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
		  }
		});
		
  });
  app.get('/login',function(req,res){
  	res.render('login', {
	         uname:req.session.uname 
	        
        });
    
  });
  
  
  
 //注册
  app.get('/reg',function(req,res){
  	res.render('reg', {
	          uname:req.session.uname
        });
  });
  app.post('/reg',function(req,res){
  	
  	var admin = AV.Object.extend('admin');
  	var query = new AV.Query(admin);
  	var uname = req.body.username;
  	var pws = req.body.password;
		query.descending('createdAt');
		query.equalTo("userName",uname);
		query.find({
		  success: function(results) {
		  	if(results.length == 0){
		  		var post = new admin();
		  		post.set("userName",uname);
			  	post.set("password",pws);
			  	post.save(null,{
			  		success: function(post){
			  			res.redirect('/');
			  		},
			  		error:function(post,error){
			  			console.log('Failed to create new object, with error message: ' + error.message)
			  		}
			  	});
			  	
		  	}else{
		  		
		  		res.redirect('/reg');
		  	}	   
		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
		  }
		});
  	
  });
//登出

 app.get('/logout', function (req, res) {
    req.session.uname = null;
    res.redirect('/');
  });




}

