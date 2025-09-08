document.addEventListener('DOMContentLoaded', async () => {
  // 1. Get selected text from URL parameter and display it
  const params = new URLSearchParams(window.location.search);
  const selectedText = params.get('text') || '...';
  document.getElementById('selected-text').textContent = selectedText;

  // 2. Check for host permission and show the permission section if needed
  const permission = { origins: ["<all_urls>"] };
  try {
    const hasPermission = await browser.permissions.contains(permission);
    if (!hasPermission) {
      document.getElementById('permission-section').style.display = 'block';
      document.getElementById('grant-button').style.display = 'inline-block';
    }
  } catch (error) {
    console.error("Could not check permissions:", error);
  }


  // 3. Add event listener for the "Dismiss" button
  document.getElementById('dismiss-button').addEventListener('click', () => {
    window.close();
  });

  // 4. Add event listener for the "Grant Permission" button
  document.getElementById('grant-button').addEventListener('click', async () => {
    try {
      const granted = await browser.permissions.request(permission);
      if (granted) {
        // Permission granted, no further action needed here besides closing.
        window.close();
      }
    } catch (error) {
      console.error(`Error requesting permission: ${error}`);
      // If there's an error, the user can still dismiss the page.
    }
  });
});