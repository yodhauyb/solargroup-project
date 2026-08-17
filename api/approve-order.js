export default async function handler(req, res) {
  const { id, email } = req.query;

  if (!id) {
    return res.status(400).send('<h3>Invalid Request: Missing Transaction ID</h3>');
  }

  // HTML response jo link click hone par dikhega
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`
    <html>
      <head>
        <title>Order Approval - SOLARGROUP</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-[#040d24] text-white flex items-center justify-center h-screen font-sans">
        <div class="bg-[#081a42] p-8 rounded-3xl border border-blue-500/20 text-center max-w-md shadow-2xl">
          <div class="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
          <h2 class="text-2xl font-bold mb-2">Order Approved Successfully!</h2>
          <p class="text-blue-300/60 text-sm mb-6">Transaction ID: ${id}</p>
          <p class="text-sm text-blue-200 mb-6">User email: <b>${email || 'N/A'}</b> has been verified and approved.</p>
          <a href="/" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition">Go to Website</a>
        </div>
      </body>
    </html>
  `);
}