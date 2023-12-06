import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path"
import branch from "git-branch"
// https://vitejs.dev/config/

process.env.VITE_USER_NAME=""
process.env.VITE_USER_PASSWORD=""

if (!process.env.VITE_API_ENDPOINT) {
  /*
      Note that in here it's still going to be staging because production
      has CORS limits. Override VITE_API_ENDPOINT on your own
      if you'd like to use the local copy of the backend.
  */
  const gitBranch = branch.sync() || "";
  if (gitBranch === "main") {
    process.env.VITE_ADMISSIONS_API_ENDPOINT = "";
  }
  else {
    process.env.VITE_API_ENDPOINT = "http://127.0.0.1:8080/api/v1";
    process.env.VITE_USER_NAME="admin"
    process.env.VITE_USER_PASSWORD="admin"
  }
}
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [vue()],
})
