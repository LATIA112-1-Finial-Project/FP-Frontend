import { defineStore } from "pinia";
import {UserInfoFromLogin} from "@/apiModel/user/types";

const info = {
    token: "",
    email: "",
    username: "",
};

export const useAuthStore =  defineStore('auth', {
    state: () => ({
        userInfo: info,
    }),
    actions: {
        setUserInfoFromLogin(userInfo: UserInfoFromLogin = info) {
            this.userInfo.token = userInfo.token;
            this.userInfo.email = userInfo.email;
        },
        setUserInfo(userInfo: UserInfoFromLogin = info) {
            this.userInfo.username = userInfo.username;
            this.userInfo.email = userInfo.email;
        },
        logout() {
            this.userInfo.token = "";
            this.userInfo.username = "";
            this.userInfo.email= "";
        },
    },
    getters: {
        isLoggedIn: (state) => !!state.userInfo.token,
    },
});
