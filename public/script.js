new Vue({
    el: "#app",
    data: {
        total: 0,
        products: [],
        card:[],
        removeClass: false,
        search: 'cat',
        lastSearch: '',
        loading: false,
    },
    methods:{
        addToCard: function (product) {
           let cartProduct =(this.card.filter(function(item){
               return  item.id == product.id;
            }));
            
            if(cartProduct.length){
                //is is souble
                this.card[this.card.indexOf(product)].qty++;
                
            }else{
                //if is no exist yet
                product.qty++;
                this.card.push(product);
            }
        
           this.total += product.price;
           
        }, 
        addQty: function (product){
            this.card[this.card.indexOf(product)].qty++;
            this.total += product.price;
        },
        decreseQty: function (product) {
            if((this.card[this.card.indexOf(product)].qty) > 1){
                this.card[this.card.indexOf(product)].qty--;
                this.total -= product.price;
                product.remove=false;
                
            }
            else if((this.card[this.card.indexOf(product)].qty) > 0){
                product.remove=true;
                this.total -= product.price;
                this.card[this.card.indexOf(product)].qty--;

            }
            else{
                this.card.splice(this.card.indexOf(product),1);
            }

        },
        onSubmit: function(e){
            this.products = [];
            this.loading = true;
            let path="/search?q=" + this.search.trim();
            // GET /someUrl
            this.$http.get(path).then(response => {
            
                // get body data
                this.lastSearch = this.search;
                console.log(response.body)
                
                for (const key in  response.body) {
                        if ( response.body.hasOwnProperty(key)) {
                            const element =  response.body[key];
                            element.qty = 0;
                            element.remove = false;
                            this.products.push(element)

                        }
                }
                this.loading= false;

            }, response => {
                // error callback
               
            });
        
        }
        
    },
    filters:{
        curency: function(price){
            return "$".concat(price.toFixed(2))
        }
    },
    created: function () {
        this.onSubmit();
    },
});
