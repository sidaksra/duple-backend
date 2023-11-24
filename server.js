const express = require('express');
const app = express();
const port = 5000;
const connectDB = require('./db/dbConnect');
const User = require('./db/user');
const cors = require('cors');
const bcrypt = require('bcrypt'); //For Password hashing
const validator = require('validator'); //it is used for to check the email (is it following the valid format)

//middleware for parsing JSON
app.use(express.json());

//enable cors 
app.use(cors());

//Signup Post Request
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
        
        // Find Wheather the name and email Already Exists in DB 
        const UsernameExist = await User.findOne({ username });
        const EmailExist = await User.findOne({ email });
  
        // Error Handling
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

        // Saving the user Credentials in the Database
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

      //Compare the Hash Password with the password entered by the user
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      //If not valid
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid Password' });
      }
  
      return res.status(200).json({ message: 'Sign In Success' });
  
    } catch (error) {
      return res.status(500).json({ error: 'Sign In Failed.' });
    }
});
  
// Connect to the database
connectDB();

// Listen the server
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

