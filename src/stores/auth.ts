import { defineStore } from "pinia";
import {UserInfo} from "@/apiModel/user/types";

const info = {
    token: "",
    username: "",
};

export const useAuthStore =  defineStore('auth', {
    state: () => ({
        userInfo: info,
    }),
    actions: {
        setUserInfo(userInfo: UserInfo = info) {
            this.userInfo = userInfo;
        },
        logout() {
            this.token = "";
        },
    },
    getters: {
        isLoggedIn: (state) => !!state.userInfo.token,
    },
});
