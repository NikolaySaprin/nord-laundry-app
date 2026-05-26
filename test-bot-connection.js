/**
 * Script to test the bot webhook connection
 * Run this to verify if the bot is accessible
 */

const testBotConnection = async () => {
  const botUrl = process.env.BOT_WEBHOOK_URL || 'http://127.0.0.1:3001/api/application';
  
  console.log('🔍 Testing bot webhook connection...');
  console.log('URL:', botUrl);
  console.log('---');

  const testData = {
    name: 'Test User',
    phone: '+79991234567',
    sphere: 'Test Sphere',
    source: 'test_script'
  };

  try {
    console.log('📤 Sending test request...');
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(botUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response status text:', response.statusText);
    
    const responseText = await response.text();
    console.log('📥 Response body:', responseText);

    if (response.ok) {
      console.log('✅ Bot webhook is working correctly!');
    } else {
      console.log('❌ Bot webhook returned an error');
    }
  } catch (error) {
    console.error('❌ Failed to connect to bot webhook:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    console.log('\n💡 Possible reasons:');
    console.log('1. Bot is not running on port 3001');
    console.log('2. Bot does not have /api/application endpoint');
    console.log('3. Firewall is blocking the connection');
    console.log('4. Bot is running on a different host/port');
    
    console.log('\n🔧 Suggestions:');
    console.log('1. Check if bot is running: docker compose ps');
    console.log('2. Check bot logs: docker compose logs webhook');
    console.log('3. Try: curl -X POST http://127.0.0.1:3001/api/application -H "Content-Type: application/json" -d \'{"name":"Test","phone":"+79991234567"}\'');
  }
};

testBotConnection();
