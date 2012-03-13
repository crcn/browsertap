var _     = require('underscore'),
fs        = require('fs'),
walkr     = require('walkr'),
path      = require('path'),
resolve   = require('resolve'),
step      = require('stepc'),
mkdirp    = require('mkdirp'),
async     = require('async'),
mergeDirs = require('./mergeDirs'),
outcome   = require('outcome'),
sprintf   = require('sprintf').sprintf;

_.str = require('underscore.string');


exports.params = {
	'directories.src': true,
	'directories.lib': true,
	'target': true
}

exports.run = function(ops, next) {


	var dirs       = ops.directories || {},
	srcDir         = ops.input || dirs.src,
	odir           = ops.output || dirs.lib,
	targetPlatform = ops.target || ops.task.split(':').shift(),
	platforms      = _.uniq(ops.platforms ? ops.platforms.concat(targetPlatform) : [targetPlatform]);
		
	if(!srcDir || !odir || !targetPlatform) {
		throw new Error("Missing src, lib, or platform");
	}

	var outputDir    = odir + "/" + targetPlatform,
	targetSrcDir     = srcDir + "/" + targetPlatform,
	outputPkg        = outputDir + "/package.json",
	outputModulesDir = outputDir + "/node_modules",
	rootPkg          = readJSON(ops.cwd + "/package.json"),
	nodeModulesDir   = ops.cwd + "/node_modules",
	srcPkg           = {},
	strict 			 = ops.strict == undefined ? true : ops.strict,
	linkTo           = ops.link;


	console.log(sprintf('==> merge %s-> %s', _.str.rpad(rootPkg.name + " ", 0,' '), path.relative(ops.root || ops.cwd, outputDir)));


	step(

		/**
		 */

		function() {

			path.exists(targetSrcDir, this);

		},

		/**
		 */

		function(exists) {


			//strict may not always be appopriate - if an app is using a third party lib
			//and all that exists is a common lib - we don't want this getting caught
			if(!exists && strict) return next(new Error(sprintf('"%s" is not a valid target', targetPlatform)));

			mkdirp(outputModulesDir, 0777, this);

		},


		/**
		 */

		function() {

			fs.writeFileSync(outputPkg, JSON.stringify(rootPkg, null, 2));

			this();
		},

		/**
		 */

		function() {

			fs.readdir(nodeModulesDir, this);
		},

		/**
		 */

		function(err, dirs) {

			//node_modules does NOT exist
			if(err) {
				return this();
			}

			async.forEach(dirs,
				function(dir, next) {
					fs.symlink(nodeModulesDir + "/" + dir, outputModulesDir + "/" + dir, function() {
						next();
					});
				},
				this);
		},

		/**
		 */

		next.success(function() {
			linkToParent(outputDir, linkTo, this);
		}),

		/**
		 */

		next.success(function() {

			//at this point, it doesn't matter if the package.json exists. Default dir is src/
			this(null, readPackage(targetSrcDir));
		}),


		/**
		 */

		next.success(function(pkg) {

			srcPkg = pkg;
			
			platforms = _.uniq(platforms.concat(pkg.original.platforms || []));

			walkr(targetSrcDir, outputDir).
			filter(pkg.src). //ommit the src dir for now
			filter(/package.json/).
			filter(walkr.copy).
			start(this);

		}),

		/**
		 */

		next.success(function() {

			mergeDirs(srcDir, platforms).
			mapDir(function(dir, next) {
				next(null, readPackage(dir).src);
			}).
			filterFile(/package\.json/, mergeDirs.mergeJSON("package.json")).
			// filterFile(mergeDirs.parseTemplate({})).
			join(outputDir + "/" + (srcPkg.original.directories.src || '/')).
			complete(this);
		}),

		/**
		 */

		next.success(function() {
			var deps = Object.keys(readPackage(outputPkg).original.dependencies || {});
			// deps = deps.concat(Object.keys(rootPkg))
			this(null, deps);
		}),

		/**
		 */

		next.success(function(deps) {

			var pkgPaths = [];

			for(var i = deps.length; i--;) {
				pkgPaths.push(readPackage(nodeModulesDir + "/" + deps[i]));
			}


			async.filter(pkgPaths, meshable, this);
		}),

		/**
		 */

		function(makeable) {

			async.forEach(makeable, 
				function(pkg, next) {

					exports.run({
						input: pkg.src,
						output: pkg.lib,
						cwd: pkg.dir,
						target: targetPlatform,
						root: ops.root || ops.cwd,
						platforms: platforms,
						strict: false,
						link: outputModulesDir + "/" + path.basename(pkg.dir)
					}, outcome(next).error(next).success(next));

				},
				this);

		},

		/**
		 */

		next.success(function() {

			next();			
		})

	);
}


/**
 */

function readPackage(pkgPath) {

	if(pkgPath.indexOf('package.json') == -1) {
		pkgPath += "/package.json";
	}

	var pkg = readJSON(pkgPath),
	dir = path.dirname(pkgPath);


	if(!pkg.directories) {
		pkg.directories = {};
	}

	var dirs = pkg.directories;



	var cfg = {
		dir: dir,
		src: path.normalize(dir + "/" + (dirs.src || '')),
		lib: path.normalize(dir + "/" + (dirs.lib || 'lib')),
		original: pkg
	};

	return cfg;
}

/**
 */

function readJSON(cfgPath) {

	try {

		return JSON.parse(fs.readFileSync(cfgPath, "utf8"));

	} catch(e) {

		return {};

	}
}

/**
 */

function linkToParent(outputDir, to, next) {

	if(!to) return next();

	step(
		function() {
			fs.unlink(to, this);
		},
		function() {
			fs.symlink(outputDir, to, this);
		},
		next
	);

}


/**
 */

function meshable(pkg, next) {

	var meshable = !!pkg.original.mesh;

	if(!meshable) {
		//for debugging
		//console.log("skip " + pkg.original.name);
	}

	next(meshable);
}
