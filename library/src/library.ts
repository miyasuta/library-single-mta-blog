/*!
 * ${copyright}
 */

import Lib from "sap/ui/core/Lib";


// library dependencies must also be imported here
import "sap/ui/core/library";
import "sap/m/library";
import "sap/ui/layout/library";

/**
 * Initialization Code and shared classes of library miyasuta.library.
 */

// delegate further initialization of this library to the Core
const thisLib: { [key: string]: unknown } = Lib.init({
	name: "miyasuta.library",
	version: "${version}",
	dependencies: [
		// keep in sync with the ui5.yaml and .library files
		"sap.ui.core",
		"sap.m",
		"sap.ui.layout"
	],
	types: [],
	interfaces: [],
	controls: [],
	elements: [],
	noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
}) as { [key: string]: unknown };


// export the library namespace
export default thisLib;
