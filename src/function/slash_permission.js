// // function for set the slash commands permission

// // import var from other files
// const client = require("../..");
// const { guild_f } = require("./guild")
// const { permissions } = require(`../../config.json`);


// module.exports = {

//     // the function
//     async slash_permission() {

//         // var for guild
//         const guild = await guild_f();

//         // input: get the slash commands
//         const slash_commands = guild.commands;

//         // for each loop
//         slash_commands.cache.forEach(slash_command => {
            
//             // find the roles required
//             const permission_roles = permissions.find(element => element?.key === slash_command.name);
//             if (permission_roles && permission_roles.roles.length > 0) {
//                 console.log(slash_command.name);
                
                
//                 // var slash_command_permissions and set the everyone's permission to false
//                 let slash_command_permissions = [{
//                     id: guild.roles.everyone.id,
//                     type: `ROLE`,
//                     permission: false
//                 }];

//                 // push the roles required data
//                 permission_roles.roles.forEach(role => {
//                     slash_command_permissions.push({
//                         id: role,
//                         type: `ROLE`,
//                         permission: true
//                     })
//                 })

//                 guild.commands.permissions.set({
//                     command: slash_command,
//                     permissions: slash_command_permissions
//                 })
//             }
//         });

//         // output
//         console.log(`slash permission set`);
//     }
// }