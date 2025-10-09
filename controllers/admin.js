const User = require("../models/user");
const Recipe = require("../models/recipe");

// ✅ Get all users
exports.getUsers = async (req, res) => {
  try{
 const users = await User.findAll({ attributes: ["id", "name", "email", "isAdmin","banned"],
   where: {
        isAdmin: false // 👈 Exclude admin users
      }
  });// 👈 Exclude admin users
 console.log('users fetched:',users.map(u=>u.dataValues))
  res.json(users);
  }
  catch(error)
  {
     res.status(500).json({message:'error fetching users',error:error.message
    })
  }
 
};

//get recipes
exports.getRecipes=async(req,res)=>{
  try{
    const recipes=await Recipe.findAll({include:[{as:'User',model:User,attributes:['id','name'], where: { isAdmin: false } }]})
    res.json(recipes);

  }
  catch(error)
  {
    res.status(500).json({message:'error fetching recipes',error:error.message
    })
  }
}
// ✅ Ban a user
exports.banUser = async (req, res) => {
  await User.update({ banned: true }, { where: { id: req.params.id } });
  res.json({ message: "User banned" });
};

// ✅ Approve a user (remove ban)
exports.approveUser = async (req, res) => {
  await User.update({ banned: false }, { where: { id: req.params.id } });
  res.json({ message: "User approved" });
};

// ✅ Remove a recipe
exports.deleteRecipe = async (req, res) => {
  await Recipe.destroy({ where: { id: req.params.id } });
  res.json({ message: "Recipe deleted by admin" });
};