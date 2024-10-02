export default {
    success(message) {
      this.showToast(message, 'bg-success text-light');
    },
    error(message) {
      this.showToast(message, 'bg-danger text-light');
    },
    showToast(message, className) {
      const toastContainer = document.createElement('div');
      toastContainer.classList.add('toast', 'show', className);
      toastContainer.setAttribute('role', 'alert');
      toastContainer.setAttribute('aria-live', 'assertive');
      toastContainer.setAttribute('aria-atomic', 'true');
  
      const toastBody = document.createElement('div');
      toastBody.classList.add('toast-body');
      toastBody.innerText = message;
      toastContainer.appendChild(toastBody);
  
      const toastCloseButton = document.createElement('button');
      toastCloseButton.classList.add('btn-close');
      toastCloseButton.setAttribute('type', 'button');
      toastCloseButton.setAttribute('data-bs-dismiss', 'toast');
      toastCloseButton.setAttribute('aria-label', 'Close');
      toastContainer.appendChild(toastCloseButton);
  
      // Ajouter le toast à la page principale
      document.body.appendChild(toastContainer);
  
      // Afficher le toast
      const bootstrapToast = new window.bootstrap.Toast(toastContainer);
      bootstrapToast.show();
  
      // Supprimer le toast après 3 secondes
      setTimeout(() => {
        document.body.removeChild(toastContainer);
      }, 3000);
    }
  };