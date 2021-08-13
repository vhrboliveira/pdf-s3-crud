export default function Logout() {
  localStorage.removeItem('AUTH_TOKEN');
  window.location = '/';
}
