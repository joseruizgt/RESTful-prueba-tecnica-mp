const constraints = require("./Constraints");
const Usuario = require("./Usuario");
const Fiscalia = require("./fiscalia");



module.exports = async () => {
    // Relationships
    try {
        // await Usuario.sync();
        // await Fiscalia.sync();
        await constraints();
        console.log('Synchronization has been success')
    } catch (error) {
        console.log(error)
    }
}