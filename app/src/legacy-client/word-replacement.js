import $ from 'jquery';
window.$ = $;

$(function(){
    if (!$('#wordReplacementModal').length) {
        return;
    }

    $('#wordReplacementModal').on('show.bs.modal', function() {
        // Clear out DOM
        getReplacementElements().each(function(){
            $(this).remove();
        })

        loadWordReplacementSettings(); 
        $('[name="word-replacements-censor-profanity"]').prop('checked', window._wc.censorProfanity);

        window._wc.wordReplacements.forEach(function(replacement) {
            var $newReplacement = $('.list-group-replacement-prototype')
                                    .clone()
                                    .removeClass('list-group-replacement-prototype')
                                    .removeAttr('hidden')
                                    .appendTo('.list-group-replacements');

            $newReplacement.find('.text-to-find').val(replacement.find)
            $newReplacement.find('.text-to-replace-with').val(replacement.replacement)
        });

        if (!window._wc.wordReplacements.length) {
            // Add one to get us started
            addNewReplacement();
        }

        updateReplacementButtonsVisibility();
    });

    $(document).on('click','.addReplacementButton', addNewReplacement);
    $(document).on('click','.removeReplacementButton', function(){
        removeReplacement($(this));
    });

    $(document).on('change keyup', '.list-group-replacements input', function() {
        $(this).popover('dispose');
    });

    function getReplacementElements() {
        return $('.list-group-replacements .list-group-item:not(.list-group-replacement-prototype)');
    }

    function addNewReplacement() {
        if (requireEmptyTextsAndFoundEmptyOnes()) {
            return;
        }

        $('.list-group-replacement-prototype')
            .clone()
            .removeClass('list-group-replacement-prototype')
            .removeAttr('hidden')
            .appendTo('.list-group-replacements');
        
        // Init tooltips on buttons again because we were shuffling around HTML
        $('[data-toggle="tooltip"]').tooltip();

        updateReplacementButtonsVisibility();

        // Focus text box
        getReplacementElements().find('.text-to-find').last().focus();
    }

    function removeReplacement($replacement) {
        $replacement.parents('.list-group-item').remove();
        updateReplacementButtonsVisibility();
        $('.tooltip, .popover').remove(); // if any are showing

        if (getReplacementElements().length < 1) {
            addNewReplacement();
        }
    }

    function updateReplacementButtonsVisibility() {
        // Only show add button on last row
        $('.addReplacementButton').each(function() {
            $(this).attr(
                'hidden',
                $('.addReplacementButton').length > 0
                    && !$(this).parents('.list-group-item').is(':last-child')
            );
        });
    }

    function requireEmptyTextsAndFoundEmptyOnes() {
        var foundEmpty = false;
        getReplacementElements().find('input.text-to-find').each(function() {
            if ($(this).val() == '') {
                $(this)
                    .popover({
                        'content':'<strong class="text-danger">Required</span>',
                        'placement':'top',
                        'html':true,
                        'animation':false
                    })
                    .popover('show')
                    .focus();
                foundEmpty = true;
            }
        });

        return foundEmpty;
    }

    $('#saveWordReplacementsButton').on('click', function() {
        window._wc.censorProfanity = $('[name="word-replacements-censor-profanity"]').is(':checked');

        window._wc.wordReplacements = [];
        getReplacementElements()
            .each(function(){
                var textToFind = $(this).find('input.text-to-find').val();
                var textToReplaceWith = $(this).find('input.text-to-replace-with').val();
                if (textToFind) {
                    window._wc.wordReplacements.push({
                        'find':textToFind,
                        'replacement':textToReplaceWith,
                    });
                }
            });


        var settings = JSON.parse(window.localStorage.getItem("webcaptioner-settings")) || {};
        settings.wordReplacements = window._wc.wordReplacements;
        settings.censorProfanity = window._wc.censorProfanity;

        window.localStorage.setItem("webcaptioner-settings", JSON.stringify(settings));
        
        // Add some hardcoded word replacements here that won't be saved to local storage
        window._wc.wordReplacements = window._wc.wordReplacements.concat([
            {
                find: 'Kurt Grimes,Kirk Grimes',
                replacement: 'Curt Grimes',
            },
            {
                find: 'Kurt',
                replacement: 'Curt',
            },
            {
                find: 'web captioner,web caption or',
                replacement: 'Web Captioner',
            },
            {
                find: ':-)',
                replacement: '<i class="fa fa-smile-o" aria-hidden="true"></i>',
            },
            {
                find: ':-(',
                replacement: '<i class="fa fa-frown-o" aria-hidden="true"></i>',
            },
            {
                find: 'Star Trek',
                replacement: '<i class="fa fa-hand-spock-o" aria-hidden="true"></i> Star Trek',
            }
        ]);

        if (window._wc.censorProfanity) {
            // English only
            window._wc.wordReplacements.push({
                find: 'ailihpooz,yffiy,srewohs wolley,ioay,hsifrats delknirw,nem gnipparw,rewop etihw,maerd tew,kcabtew,knaw,avluv,rueyov,ailihperarov,dnaw teloiv,rotarbiv,dnuom sunev,anigav,ailihporu,yalp arhteru,trikspu,gnisserdnu,puc eno slrig owt,eikniwt,kniwt,tawt,yhsut,lrigbut,lrig but,msidabirt,ynnart,daehlewot,ressot,sselpot,yttit,seittit,stit,tit,etihw thgit,pu deit,gnitaorht,emoseerht,gniggab aet,ym etsat,evol detniat,regniws,akitsaws,nemow yrtlus,slrig edicius,skcus,kcus,yggod elyts,bulc pirts,odapparts,noparts,no parts,knups,sgel daerps,egoops,esoom egoolps,egoolps,cips,gnillabwons,hctans,tums,tuls,eyetnals,teeks,gnipmirhs,atohs,yttihs,pmilbtihs,***s,tihs,irabihs,elamehs,yssup devahs,revaeb devahs,yxes,oxes,xes,nemes,gnirossics,gnolhcs,tacs,murotnas,msidas,enobmort ytsur,sretsis 5 reh dna mlap ysor,mlap ysor,gnimmir,bojmir,lrigwoc esrever,mutcer,tsipar,gnipar,epar,renob gnigar,daehgar,miuq,feeuq,faeuq,yssup,sebup,chtp,gnicreip trebla ecnirp,onrop,nrop,etuhcpoop,etuhc poop,ynanup,gnatnoop,noop,foop,yalpynop,rekoms elop,tsehc erusaelp,yobyalp,gipssip,gip ssip,gnissip,tihs fo eceip,xes enohp,sinep,gniggep,elihpodep,raebodep,ytnap,seitnap,ikap,elihpodeap,ygro,msagro,ihsaromo,yssupotco,ainamohpmyn,ohpmyn,ytidun,edun,segami wfsn,selppin,elppin,ainamohpmin,gon gin,reggin,aggin,izanoen,orgen,ihsawan,albman,gnividffum,revid ffum,sunev fo dnuom,rekcufrehtom,noitisop yranoissim,flim,etabrutsam,gnitriuqs elam,emoc em ekam,gnikamevol,atilol,gnibbonk,yknik,retsknik,ukabnik,ekik,zzij,oobreggij,oobaggij,ffo krej,tunod yllej,tiabliaj,tiab liaj,ffo kcaj,esruocretni,tsecni,gnipmuh,taf eguh,redrum ot woh,llik ot woh,kcihc toh,lrac toh,rekooh,yeknoh,citoreomoh,iatneh,erocdrah,eroc drah,bojdnah,boj dnah,orug,msagerog,lrig oog,poopdoog,rewohs nedlog,nukkog,nmad dog,estaog,xctaog,kcoc tnaig,slatineg,xes yag,gnab gnag,iranatuf,rekcapegduf,rekcap egduf,sdratkcuf,gnikcuf,nikcuf,snottub kcuf,***f,kcuf,gnittorf,bojtoof,hsitef toof,gnitsif,gniregnif,gnabregnif,gniggif,modmef,gnitriuqs elamef,hctlef,oitallef,hclef,lacef,toggaf,hcunue,trocse,msitore,citore,noitalucaje,ihcce,ssa ym tae,advd,pmuh yrd,noitca pd,noitartenep elbuod,gnod elbuod,hcnup yeknod,semmod,xirtanimod,noitanimod,tteclod,elyts god,elytsyggod,elyts yggod,elytseiggod,elyts eiggod,zehcnas ytrid,swollip ytrid,seirrebelgnid,yrrebelgnid,odlid,kcid,ailihpordned,taorhtpeed,taorht peed,eparetad,epar etad,eikrad,tnuc,sugnilinnuc,******c,tohsmuc,gnimmuc,muc,eipmaerc,snooc,nooc,elohnroc,ailihporpoc,aingalorpoc,skcoc,kcoc,kcufretsulc,spmalc revolc,sirotilc,tilc,remaets dnalevelc,krejelcric,sdubesor etalocohc,rehcnumteprac,rehcnum teprac,erohwmac,tulsmac,lrigmac,eot lemac,elohttub,skeehcttub,ttub,ytsub,elohgnub,eloh gnub,tihsllub,ebiv tellub,ekydllub,ekakkub,noitca ettenurb,srewohs nworb,llac ytoob,sboob,boob,renob,egadnob,skcollob,nikpmulb,elffaw eulb,daol ruoy wolb,boj wolb,bojwolb,noitca ednolb no ednolb,noitca ednolb,kcoc kcalb,sehctib,hctib,kcoldrib,sobmib,stit gib,srekconk gib,stsaerb gib,kcalb gib,ytilaitseb,spil revaeb,revaelc revaeb,srenaeb,renaeb,msdb,odanitsab,odratsab,dratsab,dekanerab,lagel ylerab,kcaberab,sorbgnab,gnikcus llab,kcas llab,gnikcil llab,gnikcik llab,yvarg llab,gag llab,eciuj ybab,rettab ybab,dnalebab,citoreotua,citore otua,hcnumssa,eloh ssa,elohssa,ssa,elohesra,tihsepa,suna,sugnilina,lana,enilepip naksala,tekcop toh amabala,ailihpomotorca,puc 1 slrig 2'
                        .split('').reverse('').join(''), // simple obfuscation because I'm not keen on having these words in plaintext in my source
                replacement: ''
            });
        }

        $('#wordReplacementModal').modal('hide');
        
        ga('send', 'event', 'settings', 'saveWordReplacements', window._wc.wordReplacements.length);
    });
});

var loadWordReplacementSettings = function () {
    var settings = window.localStorage.getItem("webcaptioner-settings");

    window._wc = window._wc || {};
    window._wc.wordReplacements = [];
    window._wc.censorProfanity = true;
    if (settings) {
        settings = JSON.parse(settings);
        if (settings.wordReplacements) {
            window._wc.wordReplacements = window._wc.wordReplacements.concat(settings.wordReplacements);
            window._wc.censorProfanity = settings.censorProfanity;
        }
    }
};

export default loadWordReplacementSettings;