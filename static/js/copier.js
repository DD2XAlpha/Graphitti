// Modern approach using the Clipboard API
async function copyToClipboard(text) {
    try {
        // Check if the Clipboard API is available
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            showToast('Text copied successfully!');
            return true;
        }
        // Fallback for older browsers
        const success = fallbackCopyToClipboard(text);
        if (success) {
            showToast('Text copied successfully!');
        }
        return success;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showToast('Failed to copy text', true);
        return false;
    }
}

// Fallback method using execCommand
function fallbackCopyToClipboard(text) {
    try {
        // Create a temporary textarea element
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make it invisible
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        // Execute the copy command
        const successful = document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

// Function to show Bootstrap toast
function showToast(message, isError = false) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastHtml = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${isError ? 'bg-danger text-white' : 'bg-success text-white'}">
                <strong class="me-auto">${isError ? 'Error' : 'Success'}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    // Add toast to container
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Get the toast element we just created
    const toastElement = toastContainer.lastElementChild;
    
    // Initialize the Bootstrap toast
    const toast = new bootstrap.Toast(toastElement, {
        animation: true,
        autohide: true,
        delay: 3000
    });
    
    // Show the toast
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}