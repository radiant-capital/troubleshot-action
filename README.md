Simple demonstration of issue with Safe-sdks and building tenderly actions.

- `main` branch builds latest and greatest
- The issue with this web3-action appears to be that the configuration for triggering the action with events is not working. You can do manual triggers and all works, in testing it all works too.

Here is a video [explainer](https://www.loom.com/share/3dc2a113245b4c35a35b1c0b09e0cb2f) of how it works and actually showing a functional test. So the code is sound. Reiterating the issue is that no-action is triggered by events on chain.
Just to demonstrate, I pushed an update (Sep-05-2024 04:45:19 AM UTC) for you to see that no automated trigger of the event happened.
https://bscscan.com/tx/0x86ea90b06740b9e634286b87fc1e69b2eef88746f47ab5954f042c78e3795722   

The deployed web3-action is [here](https://dashboard.tenderly.co/radiant/radiant/action/66192e98-b34b-41c2-b638-917ceb13d0ac).
