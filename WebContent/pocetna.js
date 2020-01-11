Vue.component('pocetna', {
    data: function() {
        return{
            omiljeni : null
        }
    },
    mounted : function() {
        axios.get('rest/oglasi/najpopularniji')
            .then(response => {this.omiljeni = response.data;})
            .catch(error => {alert(error.response.data);})
    },
    template : `
    <div class="content-wrap">
    <h5 class="title"><span class="text"><b>Najpopularniji</b></span></h5>
    <div class="row">
        <div class="col" v-for="oglas in omiljeni" v-if="!oglas.obrisan && oglas.aktivan == 0">
            <div class="element-wrap">
                <router-link :to="{path : '/oglas', query : {oglas : oglas.naziv}}">
                    <a class="tabic">
                        <p><img :src="oglas.nazivSlike" class="img-slika"></p>
                        <p><h5 class="text-uppercase">{{oglas.naziv}}</h5></p>
                        <p><span class="cena">{{oglas.cena}}€</span></p>
                    </a>
                </router-link>
            </div>
        </div>
    </div>
    </div>
    `,
    methods : {
    },
})