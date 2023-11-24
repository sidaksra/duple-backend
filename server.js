const express = require('express');
const app = express();
const port = 5000;
const connectDB = require('./db/dbConnect');
const User = require('./db/user');
const cors = require('cors');
const bcrypt = require('bcrypt');
const validator = require('validator'); 

//Middleware for parsing JSON
app.use(express.json());

// Enable cors 
app.use(cors());

//Signup
app.post('/signup',async(req,res)=>{
    try{
        const{username,email,password} = req.body;

        //validate email format
        if (!validator.isEmail(email)) {
          return res.status(401).json({ error: 'Invalid Email Format. Please Check Your Email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // console.log(req.body)

        const user = new User({
            username,
            email,
            password: hashedPassword,
        })
        
        const UsernameExist = await User.findOne({ username });
        const EmailExist = await User.findOne({ email });
  
        if (EmailExist && UsernameExist) {
            return res.status(401).json({
              error: 'Email and Username Already Exist. Please use different ones'
            });
        } 
        else if (EmailExist) {
            return res.status(401).json({
              error: 'Email Already Exists. Please use a different Email'
            });
        } 
        else if (UsernameExist) {
            return res.status(401).json({
              error: 'Username Already Exists. Please use a different username.'
            });
        }

        await user.save();
        return res.status(201).json({message: 'Registration Successfully. Please Sign In'})
    }
    catch(error){
        return res.status(500).json({error: 'Registration Failed'})
    }

});

// SignIn
app.post('/', async (req, res) => {
    try {
      const { email, password } = req.body;
      // console.log(req.body)
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'Email is Invalid. Please Check your Email again' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid Password' });
      }
  
      return res.status(200).json({ message: 'Sign In Success' });
  
    } catch (error) {
      return res.status(500).json({ error: 'Sign In Failed.' });
    }
});
  

connectDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

