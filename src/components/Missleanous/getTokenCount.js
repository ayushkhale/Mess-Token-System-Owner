exports.handleGetTokensCount= async()=>{
    try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
            throw new Error ('Unauthorized! Please log in.')
        }
  
        const response = await fetch(`${networkconfig.BASE_URL}/student/tokens`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(typeof data.totalTokens)
  
        if (data.totalTokens == null) {
          throw new Error('Invalid response: Tokens not found.');
        }
  
        return data.totalTokens
  
      } catch (error) {
        console.error('Error fetching token:', error);
        throw error
      } 
}