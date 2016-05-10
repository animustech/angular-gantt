(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollSender', [function() {
        // Updates the element which are registered for the horizontal or vertical scroll event

        return {
            restrict: 'A',
            require: ['^gantt', '^ganttScrollManager'],
            link: function(scope, element, attrs, controllers) {
                var el = element[0];

                var $scrollTop = $(element).scrollTop();

                var updateListeners = function() {
                    var i, l;

                    var vertical = controllers[1].getVerticalRecievers();
                    for (i = 0, l = vertical.length; i < l; i++) {
                        var vElement = vertical[i];
                        if (vElement.parentNode.scrollTop !== el.scrollTop) {
                            vElement.parentNode.scrollTop = el.scrollTop;
                        }
                    }

                    var horizontal = controllers[1].getHorizontalRecievers();
                    for (i = 0, l = horizontal.length; i < l; i++) {
                        var hElement = horizontal[i];
                        if (hElement.parentNode.scrollLeft !== el.scrollLeft) {
                            hElement.parentNode.scrollLeft  = el.scrollLeft;
                        }
                    }
                };

                var wheel = false;
                var prevScrollTop = el.scrollTop;

                var wheelScroll = function(event, delta) {
                  delta = delta || -event.originalEvent.detail / 3 ||
                  event.originalEvent.wheelDelta / 5;

                  wheel = true;

                  var $height = $('.gantt-body').height();

                  if ($scrollTop > $height)
                  {
                    $scrollTop = $height
                  }
                  else if ($scrollTop < 0)
                  {
                    $scrollTop = 0;
                  }
                  else if (el.scrollTop != 0 && el.scrollTop == prevScrollTop && $scrollTop - 100 - delta > el.scrollTop)
                  {
                    $scrollTop = $scrollTop;
                  }
                  else
                  {
                    $scrollTop = $scrollTop - delta;
                  }

                  prevScrollTop = el.scrollTop;

                  $(element).stop().animate({
                    scrollTop: $scrollTop + 'px'
                  }, {
                    duration: 50,
                    easing: 'linear',
                    progress: function() {
                      updateListeners();
                    },
                    complete: function() {
                      wheel = false;
                      updateListeners();
                    }
                  });

                  return false;
                };

                var scroll = function()
                {
                  if (!wheel)
                  {
                    $scrollTop = el.scrollTop;
                    updateListeners();
                  }
                }

                element.bind('scroll', scroll);
                element.bind('DOMMouseScroll mousewheel', wheelScroll)

                scope.$watch(function() {
                    return controllers[0].gantt.width;
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var horizontal = controllers[1].getHorizontalRecievers();
                        for (var i = 0, l = horizontal.length; i < l; i++) {
                            var hElement = horizontal[i];
                            hElement.style.width = newValue + 'px';
                        }
                    }
                });
            }
        };
    }]);
}());
