import { reduxstore } from "../redux/store";
import { setAuthError } from "../redux/slices/userauthorslice";

const LOGIN_MESSAGE = "Please login to continue.";
const WRONG_ROLE_MESSAGE = "You are not allowed to edit or delete the article.";
const ALERT_DURATION_MS = 2000;

let clearMessageTimer = null;
let redirectTimer = null;

const dispatchAuthError = (message) => {
  reduxstore.dispatch(setAuthError(message));
};

const clearTimer = (timerRef) => {
  if (timerRef) {
    clearTimeout(timerRef);
  }
};

export const requireAuthForAction = ({
  requiredRole,
  ownerUsername,
  checkOwnership = false,
  wrongRoleMessage = WRONG_ROLE_MESSAGE,
} = {}) => {
  const authState = reduxstore.getState()?.userauthorlogin || {};
  const currentUser = authState.currentuser || {};
  const isLoggedIn = Boolean(authState.loginstatus && currentUser.username);

  if (!isLoggedIn) {
    clearTimer(redirectTimer);
    dispatchAuthError(LOGIN_MESSAGE);
    redirectTimer = setTimeout(() => {
      window.location.href = "/signup";
    }, ALERT_DURATION_MS);
    return false;
  }

  const roleMismatch = requiredRole && currentUser.usertype !== requiredRole;
  const ownershipMismatch = checkOwnership && ownerUsername && currentUser.username !== ownerUsername;

  if (roleMismatch || ownershipMismatch) {
    clearTimer(clearMessageTimer);
    dispatchAuthError(wrongRoleMessage);
    clearMessageTimer = setTimeout(() => {
      dispatchAuthError(null);
    }, ALERT_DURATION_MS);
    return false;
  }

  return true;
};
