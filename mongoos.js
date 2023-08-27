const express = require("express");
const mongoose = require("mongoose");
const app = express();

var uri = "mongodb://127.0.0.1:27017/details";
const port = 4000;

app.listen(port, function () {
  console.log("Server is running on Port: " + port);
});

const connectDB = async () => {
  // connection.once("open", function () {
  //   console.log("MongoDB database connection established successfully");
  // });
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error(error);
  }
};
// before adding data to the database validate the entered properties
// required
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 25,
    // transform all of the characters of entered value to lowercase and then save
    lowercase: true,
    // trim the blank spaces before and after the value
    trim: true,
    required: true,
  },

  adminLastName: {
    type: String,
    required: function () {
      return this.admin;
    }, // this means if the user admin was true then property is required. note that you can not use arrow functions in the Schema class
  },
  // set property change the value before creating user in database
  // get property change the value after reading that specific field from document(console.log(user.salary))
  salary: {
    type: String,
    set: (v) => Math.round(v),
    get: (v) => Math.round(v),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: Boolean,
  favorites: {
    type: [String],
    // an array of strings and the entered values must be one of enum array elements
    enum: ["sport", "watching movies", "playing games", "codding", "reading"],
    // you can create a custom validator in two ways
    // validate: function (value) {
    //   if (value && value.length < 1) {
    //     throw new Error("Please enter at least one favorite");
    //   }
    // },
    // and the other way is:
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: '"enter at least one favorite"',
    },
  },
  age: {
    type: Number,
    min: 8,
    max: 120,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

const createUser = async () => {
  try {
    await connectDB();

    const user = new User({
      name: "HAMED",
      adminLastName: "",
      email: "hamed@max.com",
      password: "password1a23214",
      admin: false,
      favorites: ["sport"],
      age: 37,
      date: new Date(),
    });

    await user.save();

    console.log(user);

    await disconnectDB();
  } catch (error) {
    console.error(error);
  }
};

// get users by id from database
const findUserById = async (id) => {
  try {
    await connectDB();

    const user = await User.findById(id);

    console.log(user.salary);

    await disconnectDB();
  } catch (error) {
    console.error(error);
  }
};

// Find all users whose age is greater than 25 and less than equal 30
async function findUsersByAge(gtage, ltage) {
  await connectDB();
  User.find({ age: { $gt: gtage, $lte: ltage } })
    .select("name email age") // Select only name, email, and age fields
    .sort({ age: -1 }) // Sort by age in descending order
    .then((users) => {
      console.log(users);
    })
    .catch((err) => {
      console.error(err);
    });
  // await disconnectDB();
}

// Querying all Users ordered by 'name' field in DESCENDING order
// Limiting the result set to only 2 items max
async function findUsersByAgeInList(agesList) {
  await connectDB();
  User.find({ age: { $in: agesList } }) // // Find all users whose age is in the given list
    .sort([["name", -1]]) // Sort by 'name' field in DESCENDING order
    .limit(2) // Limit the resultset to maximum of 2 records
    //.count // Return the number of records
    .then((users) => {
      // Do something with the fetched data
      console.log(users);
    })
    .catch((err) => {
      // Handle any error from above operations
      console.error(err);
    });
}
// User.find().or([{name:"Hamid arian"},{age:37}]) // // Find all users whose name is Hamid arian or age is 37

//  Returns a paginated list of users
const getUsersPagination = async () => {
  const pageNumber = 1; // comes from client request in format of query string
  const pageSize = 8; // better to define in backend
  const users = await User.find()
    .skip((pageNumber - 1) * pageSize) //this method gets a number as a argument and skip users LT that number
    .limit(pageSize);
  console.log(users);
};

// update query#1: there is two ways to update users: first method is explains below and the second method is explained after that
async function updateUser1(id) {
  try {
    await connectDB();
    const user = await User.findById(id);
    // const user = await User.find({ _id: id }); // another way of getting user by id that returns an array of users
    // const user = await User.findOne({ _id: id }); // another way of getting user by id that returns an object
    if (!user) return;
    user.salary = 59999.9;
    // user.set({name:"Hamid arian",age:36})  another method for updating the user properties
    const result = await user.save();
    console.log(result);
    await disconnectDB();
  } catch (error) {
    console.error(error);
  }
}

// update query#2: there is two ways to update users: The second method is explained below
async function updateUser2(id) {
  try {
    await connectDB();

    // this method dosnt return any document just update the document
    // const result = await User.update(
    //   { _id: id },
    //   {
    //     $set: { name: "updated name" },
    //   }
    // );

    // this method return document before updating
    const result = await User.findByIdAndUpdate(id, {
      $set: { name: "updated name" },
    });

    // this method returns the updated document
    // const result = await User.findByIdAndUpdate(
    //   id,
    //   { $set: { name: "updated name" } },
    //   { new: true }
    // );

    console.log(result);
    await disconnectDB();
  } catch (error) {
    console.error(error);
  }
}
async function deleteUser(id) {
  try {
    await connectDB();
    // get a query object and delete it(just one item) if you want to delete many items use deleteMany() instead
    // const result = await User.deleteOne({ _id: id });
    const result = await User.findByIdAndDelete(id);
    console.log(result);
    await disconnectDB();
  } catch (error) {
    console.error(error);
  }
}

// createUser();
findUserById("64eb4db08078fdf78f3c8ae8");
// findUsersByAge(25, 35);
// findUsersByAgeInList([25, 29, 35]);
// getUsersPagination()
// updateUser1("64eb4db08078fdf78f3c8ae8");
// deleteUser("64eb48f9171c2d303e6f77f8");
