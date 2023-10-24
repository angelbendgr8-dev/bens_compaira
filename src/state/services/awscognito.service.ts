import { useDispatch } from "react-redux";
import { AppDispatch } from "./../store";

import jwtDecode from 'jwt-decode';
import { setCredentials, setData, setError, setLoading, signOut } from "../reducers/auth.reducer";

// third-party
const {
    CognitoUser,
    CognitoUserPool,
    CognitoUserSession,
    CognitoUserAttribute,
    AuthenticationDetails
} = require('amazon-cognito-identity-js');





const userPool = new CognitoUserPool({
    UserPoolId: process.env.NEXT_PUBLIC_REACT_APP_UserPoolId,
    ClientId: process.env.NEXT_PUBLIC_REACT_APP_ClientId
});



const validateToken = (token: string) => {

    const decoded: any = jwtDecode(token);
    return decoded.username;
};



export const login = async (userName: string, password: string,dispatch: any) => {
    let userData;
    try {
        const usr = await new CognitoUser({
            Username: userName,
            Pool: userPool
        });

        const authData = await new AuthenticationDetails({
            Username: userName,
            Password: password
        });

       usr.authenticateUser(authData, {
            onSuccess: (session: any) => {
                // CognitoUserSession
                const token = session.getAccessToken().getJwtToken();
                const user = {
                    email: session?.getIdToken()?.payload?.email?.toString(),
                    name: session?.getIdToken()?.payload['cognito:username'],
                };

                const data  = {
                    token: token,
                    user: user,
                }

            dispatch(setError({error: {state:false, message: ''}}))
            dispatch(setData({data: data}));
            },
            onFailure: (err: any) => {

               dispatch(setError({error: {state:true, message: err.message}}))
               dispatch(setLoading({isLoading: false}));
            }
        })
    } catch (error) {

        return
    }


}

export const register = async (userName: string, email: string, password: string) => {
     new Promise((success, rej) => {
            userPool.signUp(userName, password, [new CognitoUserAttribute({ Name: 'email', Value: email })], [], async (err: any, result: any) => {
                if (err) {
                    rej(err);
                    return;
                }
                success(result);
            });
        });
}

export const logout = () => {

    const loggedInUser = userPool.getCurrentUser();

    if (loggedInUser) loggedInUser.signOut();
};
export const forgotPassword = async (email: string,dispatch: any): Promise<any> => {

    new Promise((resolve, reject) => {
            const usr = new CognitoUser({
                Username: email,
                Pool: userPool
            });

            usr.forgotPassword({
                onSuccess: (data: any) => {
                    resolve(data);
                },
                onFailure: (err: any) => {
                     dispatch(setError({error: {state:false, message: err.message}}))
                    reject(err);
                },
                inputVerificationCode: (data: any) => {
                    dispatch(setError({error: {state:false, message: ''}}))
                    dispatch(setData({data: data}));
                    resolve(data);
                }
            });
        });
}

export const resetPassword = async (email: string, verificationCode: string, newPassword: string,dispatch: any) => {
    new Promise((resolve, reject) => {
            const usr = new CognitoUser({
                Username: email,
                Pool: userPool
            });
            usr.confirmPassword(verificationCode, newPassword, {
                onSuccess: (data: any) => {
                     dispatch(setError({error: {state:false, message: ''}}))
                    dispatch(setData({data: data}));
                    resolve(data);
                },
                onFailure: (err: any) => {
                     dispatch(setError({error: {state:true, message: err.message}}))
                    // reject(err);
                }
            });
        });
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
    new Promise((resolve, reject) => {
            const currentUser = userPool.getCurrentUser();
            if (currentUser) {
                currentUser.getSession((err: any) => {
                    if (err) reject(err);
                    currentUser.changePassword(oldPassword, newPassword, (error: any, success: any) => {
                        if (error) reject(error);
                        resolve('Password changed successfully');
                    });
                });
            } else {
                reject(new Error('user is not authenticated'));
            }
        });
}



