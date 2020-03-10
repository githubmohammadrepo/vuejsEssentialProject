
setTimeout(() => {
    var LOAD_NUM = 4;
var watcher;
new Vue({
    el: "#app",
    data: {
        total: 0,
        products: Array(),
        card:[],
        removeClass: false,
        search: 'cat',
        lastSearch: '',
        loading: false,
        addclass:0,
        oldclass: -1,
        results: Array(),
        dataCount:null
    },
    methods:{
        addToCard: function (product) {

           let cartProduct =(this.card.filter(function(item){
               return  item.id == product.id;
            }));
            
            if(cartProduct.length){
                //is is souble

                setTimeout(() => {
                    
                    this.card[this.card.indexOf(product)].changed =  false;
                    this.card[this.card.indexOf(product)].qty++;
                    
                }, 2000);
                this.card[this.card.indexOf(product)].changed =  true
                
                
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
            this.results = [];
            this.loading = true;
            let path="/search?q=" + this.search.trim();
            // GET /someUrl
            this.$http.get(path).then(response => {
                if(response.body == 'undefined'){
                    this.loading = false;
                }
                this.dataCount = (response.body).length
                this.results = response.body;
                // this.appendResults();
                // get body data
                this.lastSearch = this.search;
                this.appendResults()    
                // for (const key in  response.body) {
                //     if ( response.body.hasOwnProperty(key)) {
                       
                //         const element =  response.body[key];
                //         element.qty = 0;
                //         element.remove = false;
                //         this.products.push(element)
                // // this.appendResults();


                //     }
                // }
                this.loading= false;

            }, response => {
                // error callback
               
            });
        
        },
        appendResults: function(){
            
            if(this.results.length>LOAD_NUM){
                let rem =(this.results.length) / LOAD_NUM;
                if(rem>=2){
                    LOAD_NUM=4;
                }else{
                    LOAD_NUM=this.results.length;
                    
                }
                    let append=this.results.splice(
                        0,LOAD_NUM
                    )
                    this.products = this.products.concat(append);
                LOAD_NUM =4;
            }
            
        }
    },
    computed: {
        
       
    },
    filters:{
        curency: function(price){
            return "$".concat(price.toFixed(2))
        }
    },
    created: function () {
        this.onSubmit();
        window.document.body.style.backgroundImage="url()";

    },
    updated: function() {
        let sensor = document.querySelector('#product-list-bottom');
        watcher = scrollMonitor.create(sensor)
        watcher.enterViewport(this.appendResults)   
    },
    beforeUpdate: function() {
        if(watcher){
            watcher.destroy();
            watcher = null;
        }
    },
});
}, 3000);


