// 변화된 마지막 값을 return 하는게 reducer
// 여러개의 reducer들을 combineReducers를 이용해서 root reducer로 합쳐준다 통합관리
import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;