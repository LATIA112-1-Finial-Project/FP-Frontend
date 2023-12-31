<template>
  <t-loading v-if="isLoading" text="獲取資料中..." size="small"></t-loading>
  <div v-else class="pb-40">
    <div v-for="postItem in postData" class="flex-col h-auto w-full pb-8">
      <t-tooltip :content="showTitle + postItem.title">
        <Comment
            avatar="src/assets/user.svg"
            :author="postItem.username"
            :datetime="postItem.created"
            :content="postItem.body"
            class="comment-reply"
        >
          <template #actions>
            <t-space key="thumbUp" :size="6" @click="handleLikePost(postItem.id)" :loading="isLikePost">
              <Icon name="thumb-up"/>
              <span>{{ postItem.likes }}</span>
            </t-space>
            <t-space key="chat" :size="6" @click="handleInputCommentData(postItem.username, postItem.id)">
              <Icon name="chat"/>
              <span>回覆</span>
            </t-space>
          </template>
          <template v-if="commentNumberOfPost.find(comment => comment.id === postItem.id)?.number > 0" #reply>
            <div v-for="commentItem in commentData">
              <Comment
                  avatar="src/assets/user.svg"
                  :datetime="commentItem.created"
                  :content="commentItem.body"
                  v-if="commentItem.post_id === postItem.id"
                  class="my-1"
              >
                <template #author>
                  <span>{{ commentItem.username }}</span>
                </template>

                <template #actions>
                  <t-space key="thumbUp" :size="6" @click="handleLikeComment(commentItem.id)">
                    <t-icon name="thumb-up"/>
                    <span>{{ commentItem.likes }}</span>
                  </t-space>
                </template>
              </Comment>
            </div>
          </template>
        </Comment>
      </t-tooltip>
    </div>
  </div>
  <div v-if="!isShowComment" class="fixed bottom-0 w-full bg-white flex-col justify-between items-center pt-4">
    <t-space direction="vertical" class="w-full pr-8 mb-1">
      <t-textarea
          v-model="postTitle"
          :autosize="{ minRows: 1, maxRows: 1 }"
          placeholder="文章標題"
      ></t-textarea>
    </t-space>
    <t-space direction="vertical" class="w-full pr-8">
      <t-textarea
          v-model="postContent"
          :autosize="{ minRows: 3, maxRows: 3 }"
          tips="新增一篇貼文吧!"
          placeholder="請輸入文章內容"
          :maxlength="1000"
      ></t-textarea>
    </t-space>
    <div class="flex items-center justify-end pr-8 pb-2">
      <Button class="m-1" @click="handlePostData">
        發送
      </Button>
      <Button theme="danger" @click="handleCleanPost">
        清除
      </Button>
    </div>
  </div>
  <div v-else class="fixed bottom-0 w-full bg-white flex-col justify-between items-center pt-4">
    <t-space direction="vertical" class="w-full pr-8">
      <t-textarea
          v-model="commentContent"
          :autosize="{ minRows: 3, maxRows: 3 }"
          :tips="commentToUsername"
          placeholder="請輸入回覆內容"
          :maxlength="1000"
      ></t-textarea>
    </t-space>
    <div class="flex items-center justify-end pr-8 pb-2">
      <Button class="m-1" @click="handleCommentData">
        發送
      </Button>
      <Button class="m-1" theme="danger" @click="handleCleanComment">
        清除
      </Button>
      <Button class="ml-1" theme="warning" @click="isShowComment = !isShowComment">
        切換新增貼文
      </Button>
    </div>
  </div>
</template>


<script setup lang="ts">
import {Comment, Icon, Button, MessagePlugin} from "tdesign-vue-next";
import {ref, onMounted} from "vue";
import {useFetch} from "@vueuse/core";
import {useAuthStore} from "@/stores/auth.ts";

const isLoading = ref(false)
const isLikePost = ref(false)
const isLikeComment = ref(false)
const postContent = ref('')
const postTitle = ref('')
const commentContent = ref('')
const commentToUsername = ref('')
const commentToPostId = ref(0)
const showTitle = ref('標題：')
const isShowComment = ref(false)
const authStore = useAuthStore()
const userInfo = authStore.userInfo

interface PostData {
  id: number;
  title: string;
  body: string;
  username: string;
  created: string;
  board_name: string;
  likes: number;
}

interface CommentData {
  id: number;
  post_id: number;
  body: string;
  username: string;
  created: string;
  likes: number;
}

interface CommentNumberOfPost {
  id: number;
  number: number;
}

interface sendPostData {
  title: string;
  body: string;
  board_id: number;
}

interface sendCommentData {
  body: string;
  post_id: number;
  board_id: number;
}

interface PostDataResData {
  code: number;
  msg: string;
  data: PostData[];
}

interface CommentDataResData {
  code: number;
  msg: string;
  data: CommentData[];
}

interface LikePostResData {
  code: number;
  msg: string;
  data: string;
}

interface LikeCommentResData {
  code: number;
  msg: string;
  data: string;
}

const postData = ref<PostData[]>([])
const commentNumberOfPost = ref<CommentNumberOfPost[]>([])
const commentData = ref<CommentData[]>([])

const handleGetPostData = async () => {
  isLoading.value = true
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/posts/2', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userInfo.token}`
    }
  }).get().json<PostDataResData>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      isLoading.value = false
      return
    }
    postData.value = data.value.data
    isLoading.value = false
  }
}

const handlePostData = async () => {
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(
            {
              title: postTitle.value,
              body: postContent.value,
              board_id: 2
            } as sendPostData
        )
      },
      {
        updateDataOnError: true,
        onFetchError: (error) => {
          return error
        }
      }
  ).get().json<PostDataResData>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      postContent.value = ''
      postTitle.value = ''
      await MessagePlugin.error("文章標題與內容不可為空")
      return
    }
    postData.value = data.value.data
    postContent.value = ''
    postTitle.value = ''
    await handleGetPostData()
  }

}

const handleGetCommentData = async () => {
  isLoading.value = true
  commentNumberOfPost.value = []
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/comments/2', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userInfo.token}`
    }
  }).get().json<CommentDataResData>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      isLoading.value = false
      return
    }
    commentData.value = data.value.data
    // count comment number of post
    for (let i = 0; i < postData.value.length; i++) {
      let count = 0
      for (let j = 0; j < commentData.value.length; j++) {
        if (postData.value[i].id === commentData.value[j].post_id) {
          count++
        }
      }
      commentNumberOfPost.value.push({
        id: postData.value[i].id,
        number: count
      })
    }
    isLoading.value = false
  }
}

const handleInputCommentData = (postName: string, id: number) => {
  isShowComment.value = true
  commentToPostId.value = id
  commentToUsername.value = "正在回覆 " + postName + " 的貼文"
}

const handleCommentData = async () => {
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(
            {
              body: commentContent.value,
              post_id: commentToPostId.value,
              board_id: 2
            } as sendCommentData
        )
      },
      {
        updateDataOnError: true,
        onFetchError: (error) => {
          return error
        }
      }
  ).get().json<CommentDataResData>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      commentContent.value = ''
      await MessagePlugin.error("回覆內容不可為空，或是回覆的貼文已被刪除")
      return
    }
    commentData.value = data.value.data
    commentContent.value = ''
    await handleGetPostData()
    await handleGetCommentData()
  }
}

const handleLikePost = async (id: number) => {
  isLikePost.value = true
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/like_post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      board_id: 2,
      post_id: id
    })
  }).get().json<LikePostResData>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      isLikePost.value = false
      return
    }
    await handleGetPostData()
    isLikePost.value = false
  }
}

const handleLikeComment = async (id: number) => {
  isLikeComment.value = true
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/like_comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      board_id: 2,
      comment_id: id
    })
  }).get().json<LikeCommentResData>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      isLikeComment.value = false
      return
    }
    await handleGetCommentData()
    isLikeComment.value = false
  }
}

const handleCleanPost = () => {
  postTitle.value = ''
  postContent.value = ''
}

const handleCleanComment = () => {
  commentContent.value = ''
}

onMounted(async () => {
  await handleGetPostData()
  await handleGetCommentData()
})

</script>

<style scoped>
</style>