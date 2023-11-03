import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";
//initialState
const initialState = {
  loading: false,
  error: null,
  users: [],
  user: null,
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

//register action
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (
    { email, password, fullname }, // this is basically payload destructured - const { email, password, fullname } = payload
    { rejectWithValue, getState, dispatch } // getState - get current state of the store, // rejectWithValue - get custom errors from the backend
  ) => {
    try {
      //make the http request
      const { data } = await axios.post(`${baseURL}/users/register`, {
        email,
        password,
        fullname,
      });
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data); // without rejectWithValue we are not going to get custom error from the backend
    }
  }
);

//update user shipping address action
export const updateUserShippingAddressAction = createAsyncThunk(
  "users/update-shipping-address",
  async (
    {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
      country,
    },
    { rejectWithValue, getState, dispatch }
  ) => {
    console.log(
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
      country
    );
    try {
      //get token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/users/update/shipping`,
        {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
          country,
        },
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//user profile action
export const getUserProfileAction = createAsyncThunk(
  "users/profile-fetched",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //get token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//login action
export const loginUserAction = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue, getState, dispatch }) => {
    try {
      //make the http request
      const { data } = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });
      //save the user into localstorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//logout action
export const logoutAction = createAsyncThunk(
  "users/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //get token
    localStorage.removeItem("userInfo");
    return true;
  }
);

//users slice

const usersSlice = createSlice({
  name: "users", // name of the slice(unique)
  initialState,
  extraReducers: (builder) => {
    // #LEFT // #DOUBT - difference between reducers and extrareducers
    //handle actions
    //login
    builder.addCase(loginUserAction.pending, (state, action) => {
      // state - state in our store
      state.userAuth.loading = true; // loginUserAction.pending - for pending state what we want to change in our store
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload; // we get data received from the backend in action.payload // loginUserAction.fulfilled - what we want to change in our store on action fulfilled - assign data received from the backend to the variable in store
      state.userAuth.loading = false; // set loading to false on action fullfilled
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userAuth.error = action.payload;
      state.userAuth.loading = false;
    });
    //register
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    //logout
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = null;
    });
    //profile
    builder.addCase(getUserProfileAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    });
    builder.addCase(getUserProfileAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    //shipping address
    builder.addCase(
      updateUserShippingAddressAction.pending,
      (state, action) => {
        state.loading = true;
      }
    );
    builder.addCase(
      updateUserShippingAddressAction.fulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
      updateUserShippingAddressAction.rejected,
      (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    );
    
    //reset error action
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
      state.userAuth.error=null;
    });
    //reset success
    // builder.addCase(resetSuccessAction.pending, (state, action) => {
    //   state.isAdded = false;
    // });
  },
});

//generate reducer
const usersReducer = usersSlice.reducer;

export default usersReducer;
