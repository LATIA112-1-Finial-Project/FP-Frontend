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
        ],
    }
];

export const router: Router = createRouter({
    history: createWebHistory(),
    routes,
});
