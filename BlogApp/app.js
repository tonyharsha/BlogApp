var express=require("express"),
app=express(),
methodOverride=require("method-override"),
sanitizer=require("express-sanitizer"),
mongoose=require("mongoose"),
bodyparser=require("body-parser");


// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true,useUnifiedTopology: true});
mongoose.set('returnOriginal', false);
mongoose.set('useFindAndModify', false);
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}))
app.use(sanitizer());
app.use(express.static("public"))
app.use(methodOverride("_method"))



//MONGOOSE/MODEL/CONFIG

var blogSchema = mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})
var Blog = mongoose.model("Blog",blogSchema);


// Blog.create({
//     title:"rambo",
//     image:"https://tse1.mm.bing.net/th?id=OIP.V9vmlX4I5vti5LurxE0u2AHaEK&pid=Api&rs=1&c=1&qlt=95&w=180&h=101",
//     body:"Awesome text!!!"
// });
//ROUTS


app.get("/",function(req,res){
    res.redirect("/blogs")
})

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(error,blogs){
        if(error){
            console.log(error);
        }else{
            res.render("index",{blogs:blogs});
        }
    })
})

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new")
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    //create blog
    Blog.create(req.body.blog,function(error,newblog){
        if(error){
            console.log(error);
        }else{
             //redirect to index
            res.redirect("/blogs")
        }
    })
})

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(error,foundBlog){
        if(error){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(error,editBlog){
        if(error){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:editBlog})
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(error,updateBlog){
        if(error){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

//DESTROY ROUTE
app.delete("/blogs/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(er){
        if(er){
            res.redirect("/blogs");
        }else{
            //redirect to index
            res.redirect("/blogs");
        }
    })
})



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("blogapp server started");
})

