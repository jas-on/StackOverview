(function() {
    function repeat() {
        function checkPage(link) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                //when we get a response
                if (req.readyState === 4) {
                    var possibleAnswers = /(?:answerCount">)(.*?)</.exec(req.responseText);
                    var answerCount = possibleAnswers ? possibleAnswers[1] : 0;

                    //if there is at least one answer
                    var badgeClass;
                    if (answerCount > 0) {
                        //and one was accepted
                        if (req.responseText.indexOf("vote-accepted-on") !== -1) {
                            badgeClass = "badge badge-accepted";
                        } else {
                            //and none were accepted
                            badgeClass = "badge badge-normal";
                        }
                    } else {
                        //if there are no answers
                        badgeClass = "badge badge-none";
                    }

                    //create the badge
                    var badge = document.createElement("span");
                    badge.className = badgeClass;
                    badge.innerText = answerCount;

                    //insert the badge into the search entry
                    var target = link.parentNode.nextSibling.firstChild.firstChild;
                    target.insertBefore(badge, target.firstChild);
                }
            };

            req.open('GET', link.mod_href, true);
            req.send(null);
        };

        //determine if we're viewing google search as https
        var isSecureSearch = window.location.origin.match(/^https/);

        //get all of the search results
        var links = document.getElementsByTagName("a");
        for(var i = 0; i < links.length; ++i) {
            //support StackOverflow and StackExchange
            if (links[i].href.match(/http(s)?:\/\/[a-zA-Z.]*stackoverflow.com\/questions\/[0-9]*\//) ||
                links[i].href.match(/http(s)?:\/\/[a-zA-Z.]*stackexchange.com\/questions\/[0-9]*\//)) {

                var possibleBadge = links[i].parentNode.nextSibling.firstChild.firstChild.firstChild;
                if (possibleBadge.className.indexOf("badge") > -1) {
                    continue;
                }

                var href = links[i].href;
                if (isSecureSearch) {
                    href = links[i].href.replace(/http(?!s)/, "https");
                }

                links[i].mod_href = href;
                checkPage(links[i]);
            }
        }
    }

    repeat();
    setInterval(repeat, 2000);
})();
