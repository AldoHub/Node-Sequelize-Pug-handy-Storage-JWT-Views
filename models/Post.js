module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        title: {
            type: DataTypes.STRING
        },
        content: {
            type: DataTypes.TEXT
        },
        coverUrl: {
            type: DataTypes.STRING
        },
        covername: {
            type: DataTypes.STRING
        },
       
    });
 
    return {name: 'Post', schema: Post}
}