function downloadJSON(container) {
    // Get the content from textarea
    const jsonContent = document.getElementById(container).value;
    
    try {
        // Validate JSON
        JSON.parse(jsonContent);
        
        // Create blob with JSON content
        const blob = new Blob([jsonContent], { type: 'application/json' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (e) {
        alert('Invalid JSON format. Please check your JSON content.');
    }
}