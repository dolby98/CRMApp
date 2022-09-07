exports.userResponse = (users) =>{

    userResult = [];

    users.forEach(user => {
        userResult.push({
            name : user.name,
            userId : user.userId,
            email : user.email,
            userStatus : user.userStatus,
            userType : user.userType
        });
    });

    return userResult;
}