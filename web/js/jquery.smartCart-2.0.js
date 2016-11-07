/*
 * SmartCart 2.0 plugin
 * jQuery Shopping Cart Plugin
 * by Dipu 
 * 
 * http://www.techlaboratory.net 
 * http://tech-laboratory.blogspot.com
 */
 
(function($){
    $.fn.smartCart = function(options) {
        var options = $.extend({}, $.fn.smartCart.defaults, options);
                
        return this.each(function() {
                var obj = $(this);
                // retrive all products
                var products = $("input[type=hidden]",obj);
                var resultName = options.resultName;
                var cartItemCount = 0;
                var cartProductCount = 0; // count of unique products added
                var subTotal = 0; 
                var toolMaxImageHeight = 200;
                
                // Attribute Settings
                // You can assign the same you have given on the hidden elements
                var attrProductId = "pid";  // Product Id attribute
                var attrProductName = "pname"; // Product Name attribute   
                var attrProductPrice = "pprice"; // Product Price attribute  
                var attrProductImage = "pimage"; // Product Image attribute
                var attrCategoryName = "pcategory";
                
                // Labels & Messages              
                var labelCartMenuName = 'My Cart (_COUNT_)';  // _COUNT_ will be replaced with cart count
                var labelCartMenuNameTooltip = "Cart | Total Products: _PRODUCTCOUNT_ | Total Quantity: _ITEMCOUNT_";
                var labelProductMenuName = 'Products';
                var labelSearchButton = "Search";
                var labelSearchText = "Search";
                var labelCategoryText = "Category";
                var labelClearButton = "Clear";
                var labelAddToCartButton = "Add to Cart"; 
                var labelQuantityText = "Quantity";
                var labelProducts = 'Products';
                var labelPrice = 'Price';
                var labelSubtotal = 'Subtotal';
                var labelTotal = 'Total';
                var labelRemove = 'Remove';
                var labelCheckout = 'Checkout';
                
                var messageConfirmRemove = 'Do you want to remove "_PRODUCTNAME_" from cart?'; //  _PRODUCTNAME_ will be replaced with actula product name
                var messageCartEmpty = "Your cart is empty";
                var messageProductEmpty = "No products to display";
                var messageProductAddError = "Product cannot add";
                var messageItemAdded = 'Mã số được thêm vào giỏ hàng';
                var messageItemRemoved = 'Mã số được xóa khỏi giỏ hàng';
                var messageQuantityUpdated = 'Mã số được thêm vào giỏ hàng';
                var messageQuantityErrorAdd = 'Invalid quantity. Product cannot add';
                var messageQuantityErrorUpdate = 'Invalid quantity. Quantity cannot update';
                
                $("#payMoney").click(function() {
                   alert('Checkout...');
                   return false;
                });
                
                // Create SelectList                                
                var elmProductSelected = $('select[name="'+resultName+'"]',obj);
                if(elmProductSelected.length <= 0){
                   elmProductSelected = $("<select></select>").attr("name",resultName).attr("multiple","multiple").hide();
                   refreshCartValues();
                }else{ 
                   elmProductSelected.attr("multiple","multiple").hide();
                   populateCart(); // pre-populate cart if there are selected items  
                }                 
                obj.append(elmProductSelected);

                // custom code
                var elmMenus = $(".portfolio-items");
                var cartList = $("#cart");
                
                // prepare the product list
                populateProducts();
                
                function addToCart(i,qty) {
                     var addProduct = products.eq(i);
                     if(addProduct.length > 0) {
                        if($.isFunction(options.onAdd)) {
                          // calling onAdd event; expecting a return value
                          // will start add if returned true and cancel add if returned false
                          if(!options.onAdd.call(this,$(addProduct),qty)){
                            return false;
                          }
                        }
                        var pId = $(addProduct).attr(attrProductId);
                        var pName = $(addProduct).attr(attrProductName);
                        var pPrice = $(addProduct).attr(attrProductPrice);

                        // Check wheater the item is already added
                        var productItem = elmProductSelected.children("option[rel=" + i + "]");
                        if(productItem.length > 0){
                            // Item already added, update the quantity and total
                            var curPValue =  productItem.attr("value");
                            var valueArray = curPValue.split('|');
                            var prdId = valueArray[0];
                            var prdQty = valueArray[1];
                            prdQty = (prdQty-0) +  (qty-0);
                            var newPValue =  prdId + '|' + prdQty;
                            productItem.attr("value",newPValue).attr('selected', true);    
                            var prdTotal = getMoneyFormatted(pPrice * prdQty);
                            // Now go for updating the design
                            //var lalQuantity =  $('#lblQuantity'+i).val(prdQty);
                            //var lblTotal =  $('#lblTotal'+i).html(prdTotal);
                            $('#colQuantity'+i).val(prdQty);
                            $('#trTotal'+i).html(prdTotal);
                            // show product quantity updated message
                            //showHighlightMessage(messageQuantityUpdated);                                                      
                        } else {
                            // This is a new item so create the list
                            var prodStr = pId + '|' + qty;
                            productItem = $('<option></option>').attr("rel",i).attr("value",prodStr).attr('selected', true).html(pName);
                            elmProductSelected.append(productItem);
                            addCartItemDisplay(addProduct,qty);
                            // show product added message
                            //showHighlightMessage(messageItemAdded);                            
                        }
                        // refresh the cart
                        refreshCartValues();
                        // calling onAdded event; not expecting a return value
                        if($.isFunction(options.onAdded)) {
                          options.onAdded.call(this,$(addProduct),qty);
                        }
                     }else{
                        showHighlightMessage(messageProductAddError);
                     }
                }
                
                function addCartItemDisplay(objProd,Quantity){
                    var pId = $(objProd).attr(attrProductId);
                    var pIndex = products.index(objProd);
                    var pName = $(objProd).attr(attrProductName);
                    var pPrice = $(objProd).attr(attrProductPrice);
                    var prodImgSrc = $(objProd).attr(attrProductImage);
                    var pTotal = (pPrice - 0) * (Quantity - 0);
                    pTotal = getMoneyFormatted(pTotal);
                    

                    // custom add item to cart
                    //column name
                    var nameCol = $('<td data-th="Product"><div class="row"><div class="col-sm-2 hidden-xs"><img src="'+prodImgSrc+'" class="img-responsive"/></div><div class="col-sm-10"><h4 class="nomargin">'+pName+'</h4></div></div></td>');
                    var priceCol = $('<td data-th="Price">'+pPrice+'</td>');
                    var inputQtyCol = $('<input type="number" class="form-control text-center" value="'+Quantity+'">').attr("id","colQuantity"+pIndex).attr("rel",pIndex);
                    $(inputQtyCol).bind("change", function(e) {
                        var newQty = $(this).val();
                        var prodIdx = $(this).attr("rel");
                        newQty = newQty - 0;
                        if(validateNumber(newQty)){
                           updateCartQuantity(prodIdx,newQty);
                        } else {
                          var productItem = elmProductSelected.children("option[rel=" + prodIdx + "]");
                          var pValue = $(productItem).attr("value");
                          var valueArray = pValue.split('|'); 
                          var pQty = valueArray[1];
                          $(this).val(pQty);                          
                        }
                        return true;
                    });
                    var quantityCol = $('<td data-th="Quantity"></td>').append(inputQtyCol);
                    var subTotalCol = $('<td data-th="Subtotal" class="text-center">'+pTotal+'</td>').attr("id","trTotal"+pIndex);
                    var removeBtn = $('<button class="btn btn-danger btn-sm" rel="'+pIndex+'"><i class="fa fa-trash-o"></i></button>');
                    $(removeBtn).bind("click", function(e){
                        var idx = $(this).attr("rel");
                        removeFromCart(idx);
                        return false;
                    });
                    var removeCol = $('<td class="actions" data-th=""></td>').append(removeBtn);
                    var itemCol = $('<tr></tr>').append(nameCol).append(priceCol).append(quantityCol).append(subTotalCol).append(removeCol);
                    itemCol.attr("id","trCartItem"+pIndex)
                    cartList.find('tbody').append(itemCol);                    

                }
                
                function removeFromCart(idx){
                    var pObj = products.eq(idx);
                    var pName = $(pObj).attr(attrProductName);
                    if($.isFunction(options.onRemove)) {
                      // calling onRemove event; expecting a return value
                      // will start remove if returned true and cancel remove if returned false
                      if(!options.onRemove.call(this,$(pObj))){
                        return false;
                      }
                    }
                    var productItem = elmProductSelected.children("option[rel=" + idx + "]");
                    var pValue = $(productItem).attr("value");
                    var valueArray = pValue.split('|');
                    var pQty = valueArray[1];
                    productItem.remove();
                    
                    // $("#divCartItem"+idx,elmCartList).slideUp("slow", function(){ $(this).remove();
                    // showHighlightMessage(messageItemRemoved);
                    // //Refresh the cart
                    // refreshCartValues();});

                    $("#trCartItem"+idx, cartList).slideUp("slow", function() { 
                      $(this).remove();                      
                      //Refresh the cart
                      refreshCartValues();
                    });
                    
                    if($.isFunction(options.onRemoved)) {
                      // calling onRemoved event; not expecting a return value
                      options.onRemoved.call(this,$(pObj));
                    }
                }
                
                function updateCartQuantity(idx,qty){
                    var pObj = products.eq(idx);
                    var productItem = elmProductSelected.children("option[rel=" + idx + "]");
                    var pPrice = $(pObj).attr(attrProductPrice);
                    var pValue = $(productItem).attr("value");
                    var valueArray = pValue.split('|');
                    var prdId = valueArray[0];
                    var curQty = valueArray[1];                    
                    if($.isFunction(options.onUpdate)) {
                        // calling onUpdate event; expecting a return value
                        // will start Update if returned true and cancel Update if returned false
                        if(!options.onUpdate.call(this,$(pObj),qty)){
                          //$('#lblQuantity'+idx).val(curQty);
                          $('#colQuantity'+idx).val(curQty);                          
                          return false;
                        }
                    }


                    var newPValue =  prdId + '|' + qty;
                    $(productItem).attr("value",newPValue).attr('selected', true);    
                    var prdTotal = getMoneyFormatted(pPrice * qty);
                        // Now go for updating the design
                    //var lblTotal =  $('#lblTotal'+idx).html(prdTotal);
                    var lblTotal =  $('#trTotal'+idx).html(prdTotal);

                    //showHighlightMessage(messageQuantityUpdated);
                    //Refresh the cart
                    refreshCartValues();
                    if($.isFunction(options.onUpdated)){
                        // calling onUpdated event; not expecting a return value
                        options.onUpdated.call(this,$(pObj),qty);
                    }                    
                }
                
                function refreshCartValues(){
                    var sTotal = 0;
                    var cProductCount = 0;
                    var cItemCount = 0;
                    elmProductSelected.children("option").each(function(n) {
                        var pIdx = $(this).attr("rel"); 
                        var pObj = products.eq(pIdx);                     
                        var pValue = $(this).attr("value");
                        var valueArray = pValue.split('|');
                        var prdId = valueArray[0];
                        var pQty = valueArray[1];
                        var pPrice =  $(pObj).attr(attrProductPrice);
                        sTotal = sTotal + ((pPrice - 0) * (pQty - 0));
                        cProductCount++;
                        cItemCount = cItemCount + (pQty-0);
                    });
                    subTotal = sTotal;
                    
                    $('#totalMoney').html('<strong>Tổng '+getMoneyFormatted(subTotal)+'</strong>');
                }
                
                function populateCart(){
                   elmProductSelected.children("option").each(function(n) {
                        var curPValue =  $(this).attr("value");
                        var valueArray = curPValue.split('|');
                        var prdId = valueArray[0];
                        var prdQty = valueArray[1];
                        if(!prdQty){
                          prdQty = 1; // if product quantity is not present default to 1
                        }
                        var objProd = jQuery.grep(products, function(n, i){return ($(n).attr(attrProductId) == prdId);});                        
                        var prodIndex = products.index(objProd[0]);
                        var prodName = $(objProd[0]).attr(attrProductName);
                        $(this).attr('selected', true);
                        $(this).attr('rel', prodIndex);
                        $(this).html(prodName);
                        cartItemCount++; 
                        addCartItemDisplay(objProd[0],prdQty);                         
                   });
                   // Reresh the cart
                   refreshCartValues();
                }
                
                function populateProducts(searchString) {
                   //var isSearch = false;
                   var productCount = 0;
                   
                   $(products).each(function(i,n){
                      var productName = $(this).attr(attrProductName);
                      var productCategory = $(this).attr(attrCategoryName);
                      var isValid = true;
                      var isCategoryValid = true;

                      if(isValid && isCategoryValid) {
                          productCount++; 
                          var productPrice = $(this).attr(attrProductPrice); 
                          var prodImgSrc = $(this).attr(attrProductImage);

                          // custom add each item into menu (elmMenus)
                          var elmItem = $('<div></div>').addClass("portfolio-item");
                          if(productCategory.toLowerCase().indexOf("computers") == -1) {
                            elmItem.addClass("corporate");
                          } else {
                            elmItem.addClass("creative");
                          }

                          var itemDetail = $('<div></div>').addClass("portfolio-item-inner");
                          var itemImg = $("<img></img>").attr("src", prodImgSrc).addClass("img-responsive");
                          itemDetail.append(itemImg);

                          var item = $('<div></div>').addClass("portfolio-info");
                          item.append("<h3>" +productName+ "</h3>");
                          item.append("<span>" +productPrice+ "</span>");
                          var pId = $(this).attr(attrProductId);
                          var addToCartBt = $("<a class='preview' data-toggle='tooltip' data-placement='top' title='' href='#' rel='"+i+"'><i class='fa fa-shopping-cart'></i></a>");

                          $(addToCartBt).bind("click", function(e){
                              var idx = $(this).attr("rel");
                              var btnAdd = $(this);
                              addToCart(idx, 1);
                              showNotification(this, messageItemAdded);
                              return false;
                          });

                          item.append(addToCartBt);
                          itemDetail.append(item);
                          elmItem.append(itemDetail);

                          //add each item found
                          elmMenus.append(elmItem);
                      }                                                        
                   });
                   
                   if(productCount <= 0){
                       //showMessage(messageProductEmpty,elmPLProducts);
                   }
                }
                

                function showNotification(obj, msg) {                  
                  $(obj).attr("title", msg);
                  $(obj).tooltip('show');
                  //$(obj).tooltip({placement: 'top',trigger: 'manual'}).tooltip('show');
                  setTimeout(function() { $(obj).tooltip('destroy'); }, 1000);
                }
                
                function validateNumber(num){
                  var ret = false;
                  if(num){
                    num = num - 0;
                    if(num && num > 0){
                       ret = true;
                    }
                  }
                  return ret;
                }
                
                // Get the money formatted for display
                function getMoneyFormatted(val){
                  return val.toFixed(3);
                }

        });  
    };  
 
    // Default options
    $.fn.smartCart.defaults = {
          selected: 0,  // 0 = produts list, 1 = cart   
          resultName: 'products_selected[]', 
          enableImage: true,
          enableImageTooltip: true,
          enableSearch: true,
          enableCategoryFilter: true,
          productItemTemplate:'<strong><%=pname%></strong><br />Category: <%=pcategory%><br /><small><%=pdesc%></small><br /><strong>Price: <%=pprice%></strong>',
          cartItemTemplate:'<strong><%=pname%></strong>',
          // Events
          onAdd: null,      // function(pObj,quantity){ return true; }
          onAdded: null,    // function(pObj,quantity){ }
          onRemove: null,   // function(pObj){return true;}
          onRemoved: null,  // function(pObj){ } 
          onUpdate: null,   // function(pObj,quantity){ return true; }
          onUpdated: null,  // function(pObj,quantity){ } 
          onCheckout: null  // function(Obj){ } 
    };
    
    jQuery.log = function(message) {
      if(window.console) {
         console.debug(message);
      }
    };
    
})(jQuery);
