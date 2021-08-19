import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;
        case AUTH_USER:
            return { ...state, userData: action.payload }
            break;      
        default:
            return state;
    }
}

/* 
    Node - app.js
    Auth_USER 부분
    res.status(200).json({
         _id : req.user._id, //여기서 user정보를 가져올수있는 이유는 auth findByToken인자값으로 user를 받았는데 그건 User.js > this즉 User객체를 reutrn했기 때문
         isAdmin : req.user.role === 0 ? false : true,
         email : req.user.email,
         name : req.user.name,
         lastname : req.user.lastname,
         role : req.user.role,
         image : req.user.image
    });
    데이터가 action.payload에 있어서 userData로 선언
*/