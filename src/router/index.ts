import {
    createRouter,
    RouteRecordRaw,
    Router,
    createWebHistory,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    // Login Pages
    {
        path: "/",
        name: "LandingView",
        component: () => import("@/views/LandingView.vue"),
    },
    {
        path: "/login",
        name: "userLogin",
        meta: {
            titleKey: "登入頁面",
        },
        component: () =>
            import("@/views/user/login/userLogin.vue"),
    },
    {
        path: "/register",
        name: "userRegister",
        meta: {
            titleKey: "登入頁面",
        },
        component: () =>
            import("@/views/user/register/userRegister.vue"),
    },
    {
        path: "/forgetPassword",
        name: "userForgetPassword",
        meta: {
            titleKey: "忘記密碼頁面",
        },
        component: () =>
            import("@/views/user/forgetPassword/landView.vue"),
    },
    {
        path: "/resetPassword",
        name: "userResetPassword",
        meta: {
            titleKey: "重設密碼頁面",
        },
        component: () =>
            import("@/views/user/forgetPassword/userForgetPassword.vue"),
    },
    {
        path: "/echarts",
        name: "showEcharts",
        meta: {
            titleKey: "Echarts 展示頁面",
        },
        component: () =>
            import("@/views/charts/testECharts.vue"),
    },
    {
        path: "/dashboard",
        name: "showDashboard",
        meta: {
            titleKey: "Dashboard 頁面",
        },
        component: () =>
            import("@/views/user/dashboard.vue"),
        children: [
            {
                path: "/arxiv",
                name: "showArxiv",
                meta: {
                    titleKey: "Arxiv 頁面",
                },
                component: () =>
                    import("@/views/user/arxivPage.vue"),
            },
            {
                path: "/setting",
                name: "showSetting",
                meta: {
                    titleKey: "設定頁面",
                },
                component: () =>
                    import("@/views/user/userSetting.vue"),
            }
        ],
    }
];

export const router: Router = createRouter({
    history: createWebHistory(),
    routes,
});
