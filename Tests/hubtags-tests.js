test('getBlobFileURL', function() {
  equal(
    getBlobFileURL('https://raw.github.com/larsxschneider/ctags.js/master/Source/pre.js', 13),
    'https://github.com/larsxschneider/ctags.js/blob/master/Source/pre.js#L13');

  equal(
    getBlobFileURL('https://git.autodesk.com/schneil/AIM360Viewer/raw/d1ce5aed0b4b18c320a4ba1226a9125d11524898/Source/Common/AIM360ViewerApp.cpp', 13),
    'https://git.autodesk.com/schneil/AIM360Viewer/blob/d1ce5aed0b4b18c320a4ba1226a9125d11524898/Source/Common/AIM360ViewerApp.cpp#L13');
});


test('getRawFileMasterBranchURL', function() {
  equal(
    getRawFileMasterBranchURL('https://raw.github.com/larsxschneider/ctags.js/somebranch/Source/ctags-js.c'),
    'https://raw.github.com/larsxschneider/ctags.js/master/Source/ctags-js.c');

  equal(
    getRawFileMasterBranchURL('https://git.autodesk.com/schneil/AIM360Viewer/raw/somebranch/Source/Common/AIM360ViewerApp.cpp'),
    'https://git.autodesk.com/schneil/AIM360Viewer/raw/master/Source/Common/AIM360ViewerApp.cpp');
});


test('getRawFileURL', function() {
  equal(
    getRawFileURL('https://github.com/loarabia/Clang-tutorial/blob/master/CIrewriter.cpp'),
    'https://raw.github.com/loarabia/Clang-tutorial/master/CIrewriter.cpp');

  equal(
    getRawFileURL('https://git.autodesk.com/schneil/AIM360Viewer/blob/master/Source/Common/AIM360ViewerApp.cpp'),
    'https://git.autodesk.com/schneil/AIM360Viewer/raw/master/Source/Common/AIM360ViewerApp.cpp');
});


test('Check link master picking', function() {
  var rawSourceFile = 'https://raw.github.com/larsxschneider/ctags.js/master/Source/ctags-js.c';
  
  var somewhere = ['https://raw.github.com/murks/tata.js/123/Source/ctags-js.c', 99];
  var sameFile = ['https://raw.github.com/larsxschneider/ctags.js/master/Source/ctags-js.c', 13];
  var sameDirectory = ['https://raw.github.com/larsxschneider/ctags.js/master/Source/bla.c', 14];
  var differentBranch = ['https://raw.github.com/larsxschneider/ctags.js/123/Source/bla.c', 14];
 
  equal(
    bestBlobURLForCtag(rawSourceFile, [somewhere, sameFile, sameDirectory, differentBranch]),
    'https://github.com/larsxschneider/ctags.js/blob/master/Source/ctags-js.c#L13');

  equal(
    bestBlobURLForCtag(rawSourceFile, [somewhere, sameDirectory, differentBranch]),
    'https://github.com/larsxschneider/ctags.js/blob/master/Source/bla.c#L14');
});


test('Check link branch picking', function() {
  var rawSourceFile = 'https://raw.github.com/larsxschneider/ctags.js/somebranch/Source/ctags-js.c';
  
  var somewhere = ['https://raw.github.com/murks/tata.js/123/Source/ctags-js.c', 99];
  var masterSameFile = ['https://raw.github.com/larsxschneider/ctags.js/master/Source/ctags-js.c', 13];
  var masterSameDirectory = ['https://raw.github.com/larsxschneider/ctags.js/master/Source/bla.c', 14];
  var differentBranch = ['https://raw.github.com/larsxschneider/ctags.js/123/Source/bla.c', 14];
 
  equal(
    bestBlobURLForCtag(rawSourceFile, [somewhere, masterSameFile, masterSameDirectory, differentBranch]),
    'https://github.com/larsxschneider/ctags.js/blob/master/Source/ctags-js.c#L13');

  equal(
    bestBlobURLForCtag(rawSourceFile, [somewhere, masterSameDirectory, differentBranch]),
    'https://github.com/larsxschneider/ctags.js/blob/master/Source/bla.c#L14');
});


asyncTest('Check ctags generation and chrome storage integration', function() {
  expect(2);
  
  // Reset ctags cache for C++
  var obj= {};
  obj[ctagsLanguageKey('C++')] = {};
  chrome.storage.local.set(obj, function() {
    
    initCtags(function(saved_ctags) {
      // Check generated and saved ctags
       deepEqual(
         saved_ctags,
         {'C': {
            "Construct":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",38]],
            "ConstructDumper":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",412]],
            "addUserClass":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",151]],
            "addUserFunction":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",139]],
            "after":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",427]],
            "before":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",420]],
            "clearLocalEffect":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",97]],
            "dump":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",460]],
            "dumpNode":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",176]],
            "getChildrenEffects":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",65]],
            "getContainedEffects":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",80]],
            "getText":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",118]],
            "hasLocalEffect":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",104]],
            "m_ar":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",450]],
            "m_functionOnly":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",451]],
            "m_showEnds":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",452]],
            "m_spc":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",449]],
            "makeConstant":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",108]],
            "makeScalarExpression":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",113]],
            "parseTimeFatal":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",467]],
            "printSource":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",161]],
            "recomputeEffects":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",60]],
            "resetScope":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",43]],
            "serialize":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",132]],
            "setLocalEffect":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",90]],
            "walk":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",416]]
          }});

      // Load ctags again 
      loadCtags('C++', function(loaded_ctags) {
        deepEqual(
          loaded_ctags,
          {
            "Construct":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",38]],
            "ConstructDumper":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",412]],
            "addUserClass":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",151]],
            "addUserFunction":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",139]],
            "after":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",427]],
            "before":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",420]],
            "clearLocalEffect":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",97]],
            "dump":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",460]],
            "dumpNode":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",176]],
            "getChildrenEffects":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",65]],
            "getContainedEffects":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",80]],
            "getText":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",118]],
            "hasLocalEffect":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",104]],
            "m_ar":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",450]],
            "m_functionOnly":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",451]],
            "m_showEnds":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",452]],
            "m_spc":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",449]],
            "makeConstant":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",108]],
            "makeScalarExpression":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",113]],
            "parseTimeFatal":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",467]],
            "printSource":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",161]],
            "recomputeEffects":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",60]],
            "resetScope":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",43]],
            "serialize":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",132]],
            "setLocalEffect":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",90]],
            "walk":[["https://raw.github.com/facebook/hiphop-php/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp",416]]
          });
        start();  
      });
    });

    // Build C++ ctags cache
    updateCtags('https://github.com/facebook/hiphop-php/blob/3279ac37dc53c0650c82b69b239461bb857525ce/src/compiler/construct.cpp');
  });
});


asyncTest('Check ctags.js integration', function() {
  expect( 11 );
  var rawURL = 'example.js'

  ok( Module, "ctags.js not loaded" );
  equal(Module['CTags_getLanguage'](rawURL), 'JavaScript', 'ctags.js detected wrong language');

  Module['CTags_setOnTagEntry'](function(name, kind, lineNumber, sourceFile, language) {

    equal(sourceFile, rawURL);
    equal(kind, 'property');
    equal(language, 'JavaScript');

    if (name === 'Module.noInitialRun')
      equal(lineNumber, 2, 'Module.noInitialRun is in line 2');
    else if (name === 'Module.noExitRuntime')
       equal(lineNumber, 3, 'Module.noExitRuntime is in line 3');
    else
      ok(false, 'Unexpected tag: ' + name);
  });

  Module['CTags_setOnParsingCompleted'](function(sourceFile) {
    equal(sourceFile, rawURL, 'Parsing completed');
    start();
  });

  Module['CTags_parseFile'](rawURL);
});
