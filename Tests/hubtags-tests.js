test('Check blob URL generation', function() {

  var rawURL = 'https://raw.github.com/larsxschneider/ctags.js/master/Source/pre.js'
 
  equal(
    getBlobFileURL(rawURL, 13),
    'https://github.com/larsxschneider/ctags.js/blob/master/Source/pre.js#L13',
    'GitHub blob URL is wrong');
});


test('Check master branch file', function() {
  equal(
    getRawFileMastBranchURL('https://raw.github.com/larsxschneider/ctags.js/somebranch/Source/ctags-js.c'),
    'https://raw.github.com/larsxschneider/ctags.js/master/Source/ctags-js.c'
  );
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


asyncTest( 'Check ctags.js integration', 1, function() {

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
