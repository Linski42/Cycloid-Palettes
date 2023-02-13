var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/Llnski/Cycloid-Palettes.git', // Update to point to your repository  
        user: {
            name: 'Llnski', // update to use your name
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)