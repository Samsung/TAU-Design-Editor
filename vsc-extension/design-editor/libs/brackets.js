/**
 * This function mock function .getModule from Brackets API
 * @param {string} module path to module according to brackets_root
 */
function getModule(module) {
    return require(`../../../vsc/${module}`);
}

const brackets = {
    getModule
};

window.brackets = brackets;

module.exports = brackets;
