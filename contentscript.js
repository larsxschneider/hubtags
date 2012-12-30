function log(message) {
  //console.log(message);
}


// Detect a github page. I use this method instead of an URL check to support github enterprise
// instances.
function isGithubSite() {
  return window.location.hostname === 'github.com' || 
         $('meta[property="og:site_name"]').attr('content') === 'GitHub';
}


function isBlobPage() {
  var matcher =/^(\/[-A-Za-z0-9_.]+){2}\/blob\//;
  return matcher.exec(window.location.pathname);
}


// Returns `true` if the URL points to `github.com`. Value `false` is interpreted as github enterprise instance.
function isGithubComURL(href) {
  return href.match(/^http[s]?\:\/\/(raw\.)?github.com\//);
}


function getRawFileURL(href) {
  return href.replace(/^(http[s]?\:\/\/)(([-A-Za-z0-9_.]+\/){3})blob\/([-A-Za-z0-9_./]+)/,
    function(match, protocol, serverUserFork, _, branchPath) {
      if (isGithubComURL(href))
        return protocol + 'raw.' + serverUserFork + branchPath;
      else
        return protocol + serverUserFork + 'raw/' + branchPath;
  }) 
}


function getRawFileMasterBranchURL(rawFileURL) {
  return rawFileURL.replace(/^(http[s]?\:\/\/([-A-Za-z0-9_.]+\/){3})(raw\/)?([-A-Za-z0-9_.]+)([-A-Za-z0-9_./]+)/,
    function(match, protocolServerUserFork, _, _, branch, path) {
      if (isGithubComURL(rawFileURL))
        return protocolServerUserFork + 'master' + path;
      else
        return protocolServerUserFork + 'raw/master' + path;
    });
}


function getBlobFileURL(rawFileURL, lineNumber) {
  return rawFileURL.replace(/^(http[s]?\:\/\/)(raw\.)?(([-A-Za-z0-9_.]+\/){3})(raw\/)?([-A-Za-z0-9_./]+)/,
    function(match, protocol, _, serverUserFork, _, _,branchPath) {
      return protocol + serverUserFork + 'blob/' + branchPath;
    }) + '#L' + lineNumber;
}


function ctagsLanguageKey(language) {
  return language.replace(/\+/g,'');
}


function saveCtags(lang, ctags, callback) {
  var langKey = ctagsLanguageKey(lang);
  var obj= {};
  obj[langKey] = ctags;
  chrome.storage.local.set(obj, function() {
    log('Ctags saved: ' + lang);
    updateGithubSourceCodeLines();
    callback(obj);
  });
}


function loadCtags(lang, callback) {
  var langKey = ctagsLanguageKey(lang);
  chrome.storage.local.get(langKey, function(value) {
    if (value && value[langKey]) {
      log('Ctags loaded: ' + lang);
      callback(value[langKey]);
      updateGithubSourceCodeLines();
    } else {
      callback({});
    }
  })
};


function equalCount(a, b) {
  for (var i=0, n = Math.min(a.length, b.length); i<n && a.charAt(i) === b.charAt(i); ++i);
  return i;
}


function bestBlobURLForCtag(rawSourceFile, links) {

  var rawSourceFileMaster = getRawFileMasterBranchURL(rawSourceFile);
  var bestLink = links[0];
  var bestLinkEquality = equalCount(bestLink[0], rawSourceFile);
  var abort = false;

  links.forEach(function(link, index, array) {
    if (abort)
      return;

    if (rawSourceFile === link[0]) {
      bestLink = link;
      abort = true;
    } else {

      var equalityToRaw = equalCount(link[0], rawSourceFile);
      var equalityToRawMaster = equalCount(link[0], rawSourceFileMaster);
      var linkEquality = Math.min(equalityToRaw, equalityToRawMaster);

      if (linkEquality > bestLinkEquality) {
        bestLink = link;
        bestLinkEquality = linkEquality;
      }

    }
  });
  
  return getBlobFileURL(bestLink[0], bestLink[1]);
}


function generateCtags(rawFileURL) {
  log('Generating Ctags for ' + rawFileURL);
  Module['CTags_parseFile'](rawFileURL);
}


var current_language = 'unknown';
var current_ctags = {};


function updateGithubSourceCodeLines() {
  // Reset source code lines that have no <a> ctags links, yet 
  $('.line span').map(function() {
    if ($(this).children().length)
      $(this).data('ctagsApplied', false);
  });

  $('.line span').live('mouseover', function() {
      if (!$(this).data('ctagsApplied')) {

        log('Checking tags for: ' + this.innerText);
        var links = current_ctags[this.innerText];

        if (links)
        {
          log(links.length + ' tags found.');
          var blobFileURL = bestBlobURLForCtag(getRawFileURL(window.location.href), links);
          $(this).html('<a style="color: inherit;" href="' + blobFileURL +'">' + $(this).html() + '</a>');
        }

        // We don't want to check ctags for this <span> again
        $(this).data('ctagsApplied', true); 
      }
  });
}


function updateCtags(blobFileURL) {
  // Read language of current file
  var currentRawFileURL = getRawFileURL(blobFileURL);
  current_language = Module['CTags_getLanguage'](currentRawFileURL);
  log('Language detected: ' + current_language);

  if (current_language && current_language != 'unknown') {
    loadCtags(current_language, function(loadedTags) {
      current_ctags = loadedTags;

      generateCtags(currentRawFileURL);
    });    
  } else {
    log('Unknown language: ' + currentRawFileURL);
  }
}


function initCtags(saveCtagsCallback) {

  // Add callback for new found ctags
  Module['CTags_setOnTagEntry'](function(name, kind, lineNumber, sourceFile, language) {
    log('Found tag: ' + name);

    if (language !== current_language) {
      log.error('Oops. Wrong language?!');
      return;
    }

    var tagArray = current_ctags[name];
    if (!tagArray) {
      current_ctags[name] = tagArray = [];
    }

    var index;
    if (tagArray.some(function (tag, i) { index = i; return tag[0] === sourceFile; })) {
      if (tagArray[index][1] !== lineNumber) {
        log('Update tag: ' + name + ' -> ' + lineNumber + ':' + sourceFile);
        tagArray[index][1] = lineNumber;
      }
    } else {
      log('Add tag: ' + name + ' -> ' + lineNumber + ':' + sourceFile);
      tagArray.push([sourceFile, lineNumber]); 
    }
  });

  Module['CTags_setOnParsingCompleted'](function(sourceFile) {
    saveCtags(current_language, current_ctags, saveCtagsCallback);
  });
}


chrome.extension.onRequest.addListener(function(request, sender, callback) 
{
  if (isBlobPage() && isGithubSite()) {
    initCtags();
    updateCtags(window.location.href);
  }    
});
