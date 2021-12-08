import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT,
} from '../actions/types'

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {},
}

export default function (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false,
                error: {},
            }

        case GET_POST: 
            return {
                ...state,
                post: payload,
                loading: false,
                error: {}
            }

        case ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false,
                error: {},
            }

        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter((post) => post._id !== payload),
                loading: false,
                error: {},
            }

        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            }

        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === payload.postId
                        ? { ...post, likes: payload.likes }
                        : post
                ),
                loading: false,
                error: {},
            }

        case ADD_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: payload },
                loading: false,
                error: {}
            }

        case REMOVE_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter(comment => comment._id !== payload)
                },
                loading: false,
                error: {}
            }

        default:
            return state
    }
}
