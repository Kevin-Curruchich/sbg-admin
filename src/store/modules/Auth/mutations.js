// export const myMutations = (state)=>{

// }

export const loginUser = (state, data) => {
  localStorage.setItem("sbg-admin-access-token", data.token);
  state.user = data;
  state.status = "authenticated";
};

export const logout = (state) => {
  state.user = null;
  state.status = "no-authenticated";
  localStorage.removeItem("sbg-admin-access-token");
};
