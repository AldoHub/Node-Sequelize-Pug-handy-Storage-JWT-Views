module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type:DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatarUrl: {
            type: DataTypes.STRING
        },
        avatarname: {
            type: DataTypes.STRING
        }
       
    });
    return { name: 'User', schema: User };
    
}
