/**
 * デモ用サンプル学術論文データセット（全30本）
 * 
 * ユーザーが手元にPDFファイルを持っていない場合でも、
 * ブラウザ上でのベクトル化・UMAP・クラスタリング・類似度ネットワークの挙動を即座に確認できるよう、
 * 近年のノーベル賞受賞研究（物理学賞、化学賞、生理学・医学賞）や記念碑的論文を中心に、
 * 多様な学術領域から精選した学術論文抄録セットです。
 */

import { ExtractedPaper } from '../types';

export const SAMPLE_ACADEMIC_PAPERS: ExtractedPaper[] = [
  // ==========================================
  // 【分野1】人工知能・深層学習・言語情報処理
  // ==========================================
  {
    id: 'sample_nlp_1',
    fileName: 'attention_is_all_you_need.pdf',
    title: 'Attention Is All You Need: The Transformer Architecture',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and entirely relying on an attention mechanism to draw global dependencies between input and output.',
    fullText: 'The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.',
    pageCount: 15,
    charCount: 28400,
    fileSize: 524000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_nlp_2',
    fileName: 'bert_pretraining_deep_bidirectional.pdf',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context.',
    fullText: 'As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks, such as question answering and language inference.',
    pageCount: 16,
    charCount: 31200,
    fileSize: 610000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_ai_nobel_hopfield',
    fileName: 'hopfield_neural_networks_and_physical_systems.pdf',
    title: 'Neural Networks and Physical Systems with Emergent Collective Computational Abilities',
    abstract: 'Computational properties of use of biological organisms or to the construction of computers can emerge spontaneously from collective systems of simple interacting neurons. We examine physical spin systems possessing associative memory and energy minimum attractors, proving that nonlinear feedback architectures can store and reconstruct extensive memory patterns.',
    fullText: 'John Hopfield established the bridge between statistical physics, Ising spin glasses, and associative neural networks, earning the 2024 Nobel Prize in Physics for foundational discoveries enabling modern machine learning.',
    pageCount: 8,
    charCount: 18200,
    fileSize: 410000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_ai_nobel_hinton',
    fileName: 'hinton_deep_belief_nets_and_backpropagation.pdf',
    title: 'A Fast Learning Algorithm for Deep Belief Nets and Representation Learning',
    abstract: 'We show how to use complementary priors to eliminate the explaining away effects that make inference difficult in densely connected belief nets. Using layer-by-layer unsupervised feature learning combined with restricted Boltzmann machines and contrastive divergence, deep multi-layer neural networks can be trained efficiently to capture rich nonlinear representations.',
    fullText: 'Geoffrey Hinton revolutionized deep learning and representation theory through Boltzmann machines and gradient-based backpropagation, awarded the 2024 Nobel Prize in Physics for seminal contributions to artificial neural networks.',
    pageCount: 16,
    charCount: 34500,
    fileSize: 680000,
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 【分野2】コンピュータビジョン・画像認識・生成
  // ==========================================
  {
    id: 'sample_cv_1',
    fileName: 'unet_biomedical_image_segmentation.pdf',
    title: 'U-Net: Convolutional Networks for Biomedical Image Segmentation',
    abstract: 'There is large consent that successful training of deep networks requires many thousand annotated training samples. In this paper, we present a network and training strategy that relies on the strong use of data augmentation to use the available annotated samples more efficiently.',
    fullText: 'The architecture consists of a contracting path to capture context and a symmetric expanding path that enables precise localization. We show that such a network can be trained end-to-end from very few images.',
    pageCount: 8,
    charCount: 15400,
    fileSize: 390000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_cv_2',
    fileName: 'vision_transformer_an_image_is_worth_16x16.pdf',
    title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
    abstract: 'While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. In vision, attention is either applied in conjunction with convolutional networks, or used to replace certain components of convolutional networks while keeping their overall structure in place.',
    fullText: 'We show that this reliance on CNNs is not necessary and a pure transformer applied directly to sequences of image patches can perform exceedingly well on image classification tasks.',
    pageCount: 22,
    charCount: 42000,
    fileSize: 850000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_cv_3',
    fileName: 'diffusion_models_beat_gans_on_image_synthesis.pdf',
    title: 'Diffusion Models Beat GANs on Image Synthesis',
    abstract: 'We show that classifier guidance allows diffusion models to condition on labels and substantially improve sample quality and coverage compared to state-of-the-art Generative Adversarial Networks (GANs). We scale up model architectures and find improved training schedules.',
    fullText: 'On ImageNet 512x512, our guided diffusion model achieves state of the art FID scores, demonstrating the power of iterative denoising probabilistic models.',
    pageCount: 18,
    charCount: 35000,
    fileSize: 720000,
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 【分野3】構造生物学・創薬・計算タンパク質設計
  // ==========================================
  {
    id: 'sample_bio_1',
    fileName: 'alphafold_protein_structure_prediction.pdf',
    title: 'Highly Accurate Protein Structure Prediction with AlphaFold',
    abstract: 'Proteins are essential to life, and understanding their structure can facilitate a mechanistic understanding of their function. Decades of effort have produced powerful experimental techniques, but resolving structures remains challenging. We present computational methods to predict 3D protein structures with atomic accuracy.',
    fullText: 'Demis Hassabis and John Jumper were awarded the 2024 Nobel Prize in Chemistry for developing AlphaFold, solving a 50-year grand challenge in molecular biology through evolutionary transformer architectures.',
    pageCount: 16,
    charCount: 33000,
    fileSize: 640000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_bio_baker_rosetta',
    fileName: 'baker_de_novo_computational_protein_design.pdf',
    title: 'De Novo Computational Design of Functional Protein Structures and Macromolecular Assemblies',
    abstract: 'Natural proteins explore only a minute fraction of possible stable polypeptide folds. We present computational algorithms and energy minimization methods (Rosetta) enabling de novo design of entirely novel globular protein backbones, nanoscale protein cages, and high-affinity binders targeted against viral pathogens.',
    fullText: 'David Baker was awarded the 2024 Nobel Prize in Chemistry for computational protein design, establishing principles to create synthetic macromolecular structures unseen in nature.',
    pageCount: 14,
    charCount: 29000,
    fileSize: 590000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_bio_2',
    fileName: 'crispr_cas9_genome_editing.pdf',
    title: 'CRISPR-Cas9 System for Targeted Genome Engineering and Gene Regulation',
    abstract: 'Targeted genome editing in eukaryotic cells has revolutionized molecular biology. The CRISPR-Cas9 endonuclease from Streptococcus pyogenes can be programmed by single-guide RNAs to generate site-specific double-strand breaks in DNA, enabling precise genomic alterations.',
    fullText: 'Emmanuelle Charpentier and Jennifer Doudna were awarded the 2020 Nobel Prize in Chemistry for developing the RNA-guided CRISPR-Cas9 genetic scissors, transforming functional genomics and gene therapy.',
    pageCount: 12,
    charCount: 24000,
    fileSize: 450000,
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 【分野4】分子生物学・RNA生化学・免疫医療
  // ==========================================
  {
    id: 'sample_mrna_vaccine_kariko',
    fileName: 'kariko_weissman_nucleoside_modified_mrna_vaccine.pdf',
    title: 'Suppression of RNA Immunogenicity by Nucleoside Modification: The Foundation of mRNA Vaccines',
    abstract: 'Exogenous synthetic mRNA delivered into mammalian cells stimulates innate immune receptors including Toll-like receptors TLR3, TLR7, and TLR8, causing severe inflammatory responses. We discover that incorporating naturally occurring modified nucleosides such as pseudouridine (Psi) abolishes immunogenicity while greatly enhancing translational efficiency.',
    fullText: 'Katalin Kariko and Drew Weissman received the 2023 Nobel Prize in Physiology or Medicine for nucleoside base modifications that enabled the rapid creation of highly effective mRNA vaccines against COVID-19.',
    pageCount: 10,
    charCount: 22000,
    fileSize: 470000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_microrna_ambros',
    fileName: 'ambros_ruvkun_discovery_of_microrna.pdf',
    title: 'Post-Transcriptional Regulation of Gene Expression by Small Non-Coding microRNAs',
    abstract: 'We report the discovery of microRNAs (miRNAs), an abundant class of small ~22-nucleotide non-coding regulatory RNAs that govern gene expression in multicellular organisms. By base-pairing with complementary sequences within target messenger RNA 3 prime untranslated regions, miRNAs direct translational repression and transcript degradation.',
    fullText: 'Victor Ambros and Gary Ruvkun were awarded the 2024 Nobel Prize in Physiology or Medicine for the discovery of microRNA and its fundamental role in post-transcriptional gene regulation across metazoans.',
    pageCount: 12,
    charCount: 25400,
    fileSize: 520000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_stemcell_ips',
    fileName: 'induction_of_pluripotent_stem_cells_yamanaka.pdf',
    title: 'Induction of Pluripotent Stem Cells from Mouse and Human Fibroblasts by Defined Factors',
    abstract: 'Differentiated cells can be reprogrammed to an embryonic-like pluripotent state by the ectopic expression of four defined transcription factors: Oct3/4, Sox2, Klf4, and c-Myc (the Yamanaka factors). These induced pluripotent stem (iPS) cells exhibit the morphology, gene expression profile, epigenetic status, and pluripotency characteristic of embryonic stem cells.',
    fullText: 'Shinya Yamanaka demonstrated that cellular lineage differentiation is fully reversible without somatic nuclear transfer or unfertilized oocytes, awarded the 2012 Nobel Prize in Physiology or Medicine.',
    pageCount: 18,
    charCount: 36500,
    fileSize: 760000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_cancer_immunotherapy_honjo',
    fileName: 'honjo_allison_cancer_immunotherapy_pd1_checkpoint.pdf',
    title: 'Cancer Immunotherapy by Blockade of Immune Checkpoint Receptors PD-1 and CTLA-4',
    abstract: 'Tumor cells evade host immune surveillance by engaging inhibitory checkpoint receptors on cytotoxic T lymphocytes. Programmed cell death 1 (PD-1) delivers negative signals attenuating T cell proliferation and cytokine secretion upon binding its ligands PD-L1 and PD-L2. Monoclonal antibody blockade releases the brake on anti-tumor immune responses.',
    fullText: 'Tasuku Honjo and James P. Allison were awarded the 2018 Nobel Prize in Physiology or Medicine for discovery of cancer therapy by inhibition of negative immune regulation.',
    pageCount: 15,
    charCount: 31000,
    fileSize: 630000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_paleogenomics_paabo',
    fileName: 'paabo_neanderthal_ancient_genome_sequencing.pdf',
    title: 'A Draft Sequence of the Neandertal Genome and Ancient Human Evolutionary Genomics',
    abstract: 'We present a draft genomic sequence of the Neandertal from fossil bones discovered in Vindija Cave, Croatia. Genomic comparison with present-day humans reveals that Neandertals shared more genetic variants with present-day non-Africans than with Sub-Saharan Africans, demonstrating ancient gene flow between archaic hominins and ancestors of Eurasians.',
    fullText: 'Svante Paabo was awarded the 2022 Nobel Prize in Physiology or Medicine for pioneering ancient DNA extraction technologies, establishing the discipline of paleogenomics, and sequencing archaic hominin genomes.',
    pageCount: 24,
    charCount: 48000,
    fileSize: 980000,
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 【分野5】精密有機合成・クリック化学・ナノ材料化学
  // ==========================================
  {
    id: 'sample_click_chemistry_bertozzi',
    fileName: 'bertozzi_sharpless_bioorthogonal_click_chemistry.pdf',
    title: 'Bioorthogonal Chemistry and Copper-Free Click Chemistry in Living Cells',
    abstract: 'Chemical reactions occurring inside living biological systems must proceed selectively without perturbing native biochemical processes. We introduce bioorthogonal strain-promoted alkyne-azide cycloadditions (copper-free click chemistry) and Staudinger ligations, allowing selective covalent labeling of cell surface glycans, proteins, and lipids in vivo.',
    fullText: 'Carolyn Bertozzi, Morten Meldal, and K. Barry Sharpless received the 2022 Nobel Prize in Chemistry for the development of click chemistry and bioorthogonal chemistry.',
    pageCount: 13,
    charCount: 27500,
    fileSize: 560000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_quantum_dots_bawendi',
    fileName: 'bawendi_brus_colloidal_semiconductor_quantum_dots.pdf',
    title: 'Synthesis and Size-Tunable Optical Properties of Monodisperse Semiconductor Quantum Dots',
    abstract: 'Colloidal semiconductor nanocrystals exhibit quantum confinement effects when their physical dimensions are smaller than the Bohr exciton radius, resulting in size-dependent discrete energy levels and tunable photoluminescence spanning the visible to infrared spectra. We develop high-temperature organometallic synthesis yielding monodisperse nanocrystals.',
    fullText: 'Moungi Bawendi, Louis Brus, and Alexei Ekimov were awarded the 2023 Nobel Prize in Chemistry for the discovery and chemical synthesis of quantum dots, powering advanced displays, medical imaging, and solar cells.',
    pageCount: 14,
    charCount: 28500,
    fileSize: 580000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_organocatalysis_list',
    fileName: 'list_macmillan_asymmetric_organocatalysis.pdf',
    title: 'Asymmetric Organocatalysis: Small Enantioselective Chiral Organic Catalysts',
    abstract: 'Catalytic asymmetric chemical synthesis traditionally relied upon transition metal complexes or large biological enzymes. We introduce the third pillar of catalysis: asymmetric organocatalysis utilizing small, non-toxic chiral organic molecules such as proline and imidazolidinone salts to activate substrates via enamine and iminium ion mechanisms.',
    fullText: 'Benjamin List and David MacMillan received the 2021 Nobel Prize in Chemistry for the development of asymmetric organocatalysis, creating greener and more precise pharmaceutical synthesis routes.',
    pageCount: 11,
    charCount: 23000,
    fileSize: 460000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_lithium_battery_yoshino',
    fileName: 'goodenough_yoshino_rechargeable_lithium_ion_battery.pdf',
    title: 'Development of High-Energy-Density Rechargeable Lithium-Ion Battery Systems',
    abstract: 'Rechargeable energy storage is critical for consumer electronics and electric mobility. We demonstrate intercalation battery chemistry pairing a high-voltage lithium cobalt oxide (LiCoO2) cathode with a safe, stable carbonaceous petroleum coke/graphite anode capable of reversible electrochemical lithium insertion without dendrite formation.',
    fullText: 'Akira Yoshino, John Goodenough, and Stanley Whittingham were awarded the 2019 Nobel Prize in Chemistry for the development of lithium-ion batteries, enabling the wireless, fossil-fuel-free electronic society.',
    pageCount: 16,
    charCount: 32000,
    fileSize: 670000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_energy_perovskite',
    fileName: 'organometal_halide_perovskite_solar_cells_kojima_miyashita.pdf',
    title: 'Organometal Halide Perovskites as Visible-Light Sensitizers for Photovoltaic Energy Conversion',
    abstract: 'Organometal lead halide perovskite semiconductors (CH3NH3PbI3 and CH3NH3PbBr3) function as efficient visible-light absorbers in dye-sensitized liquid and solid-state solar cells. Their direct bandgap, high absorption coefficient, exceptional charge-carrier mobility, and long carrier diffusion lengths have propelled perovskite solar cells to groundbreaking power conversion efficiencies.',
    fullText: 'Originating from the pioneering research by Akihiro Kojima and Tsutomu Miyasaka, perovskite photovoltaics has emerged as the most rapidly advancing solar cell technology in history, bridging low manufacturing costs with high efficiency.',
    pageCount: 12,
    charCount: 23800,
    fileSize: 495000,
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 【分野6】量子物理学・光子エンタングルメント・アト秒科学
  // ==========================================
  {
    id: 'sample_quantum_entanglement_aspect',
    fileName: 'aspect_zeilinger_quantum_entanglement_bell_inequality.pdf',
    title: 'Experimental Test of Bell Inequalities and Verification of Quantum Nonlocality with Entangled Photons',
    abstract: 'Albert Einstein questioned the completeness of quantum mechanics through the EPR paradox and local hidden variable hypotheses. We report high-precision experimental tests of Bell inequalities using polarization-entangled photon pairs generated by atomic cascades and spontaneous parametric down-conversion with fast variable polarizers.',
    fullText: 'Alain Aspect, John Clauser, and Anton Zeilinger were awarded the 2022 Nobel Prize in Physics for experiments with entangled photons, establishing the violation of Bell inequalities and pioneering quantum information science.',
    pageCount: 11,
    charCount: 22800,
    fileSize: 480000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_attosecond_physics_krausz',
    fileName: 'agostini_krausz_attosecond_laser_pulses_electron_dynamics.pdf',
    title: 'Generation of Attosecond Laser Pulses and Observation of Real-Time Electron Dynamics in Matter',
    abstract: 'Electrons move in atoms and molecules on the attosecond timescale (1 as = 10^-18 seconds). Through high-harmonic generation in noble gases irradiated by intense few-cycle infrared lasers, we generate isolated extreme ultraviolet pulses with sub-femtosecond and attosecond durations, enabling direct spectroscopic tracking of ionization and electronic transitions.',
    fullText: 'Pierre Agostini, Ferenc Krausz, and Anne L Huillier were awarded the 2023 Nobel Prize in Physics for experimental methods that generate attosecond pulses of light for the study of electron dynamics in matter.',
    pageCount: 13,
    charCount: 26000,
    fileSize: 530000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_quantum_1',
    fileName: 'quantum_computational_supremacy.pdf',
    title: 'Quantum Computational Supremacy Using a Programmable Superconducting Processor',
    abstract: 'The promise of quantum computers is that certain computational tasks might be executed exponentially faster on a quantum processor than on a classical processor. We demonstrate quantum supremacy using a programmable superconducting processor named Sycamore.',
    fullText: 'Our processor takes approximately 200 seconds to sample one instance of a quantum circuit a million times, whereas a state-of-the-art classical supercomputer would require approximately 10,000 years for the equivalent task.',
    pageCount: 10,
    charCount: 19800,
    fileSize: 510000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_quantum_2',
    fileName: 'variational_quantum_eigensolver.pdf',
    title: 'A Variational Quantum Eigensolver for Quantum Chemistry and Material Simulation',
    abstract: 'Simulating quantum mechanical systems is one of the most promising applications of near-term noisy intermediate-scale quantum (NISQ) computers. The Variational Quantum Eigensolver (VQE) algorithm utilizes a hybrid quantum-classical feedback loop to find the ground state energy of molecular Hamiltonians.',
    fullText: 'We demonstrate experimental simulations of small molecular systems including lithium hydride and beryllium hydride with chemical accuracy.',
    pageCount: 14,
    charCount: 27000,
    fileSize: 580000,
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 【分野7】天体物理学・宇宙論・重力波
  // ==========================================
  {
    id: 'sample_gravitational_waves_ligo',
    fileName: 'ligo_observation_of_gravitational_waves_black_hole.pdf',
    title: 'Observation of Gravitational Waves from a Binary Black Hole Merger by LIGO',
    abstract: 'On September 14, 2015, the two advanced laser interferometer gravitational-wave detectors of LIGO in Hanford and Livingston recorded the gravitational-wave signal GW150914. The signal matches the waveform predicted by general relativity for the inspiral and merger of a pair of stellar-mass black holes and the ringdown of the resulting single black hole.',
    fullText: 'Rainer Weiss, Barry Barish, and Kip Thorne were awarded the 2017 Nobel Prize in Physics for decisive contributions to the LIGO detector and the observation of gravitational waves, opening gravitational-wave astronomy.',
    pageCount: 16,
    charCount: 33500,
    fileSize: 710000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_blackhole_ghez',
    fileName: 'penrose_ghez_supermassive_black_hole_galactic_centre.pdf',
    title: 'Discovery of a Supermassive Compact Object at the Galactic Centre and Black Hole Singularity Theorems',
    abstract: 'Using high-resolution adaptive optics and speckle imaging at the Keck and VLT observatories, we monitored stellar orbits orbiting the center of the Milky Way galaxy over two decades. The orbit of star S2 establishes the presence of a compact gravitational mass of four million solar masses within a radius of 17 light hours (Sagittarius A*).',
    fullText: 'Roger Penrose, Reinhard Genzel, and Andrea Ghez were awarded the 2020 Nobel Prize in Physics for the discovery that black hole formation is a robust prediction of general relativity and for discovering the supermassive object at our galactic center.',
    pageCount: 19,
    charCount: 38000,
    fileSize: 820000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_physics_higgs',
    fileName: 'observation_of_higgs_boson_atlas_cms.pdf',
    title: 'Observation of a New Boson at a Mass of 125 GeV with the ATLAS and CMS Experiments at the LHC',
    abstract: 'A search for the Standard Model Higgs boson is presented using proton-proton collision data recorded by the ATLAS and CMS detectors at the CERN Large Hadron Collider (LHC). An excess of events is observed with high statistical significance in the diphoton invariant mass spectrum and the four-lepton decay channel, corresponding to the discovery of a neutral scalar boson with a mass near 125 GeV, confirming the Brout-Englert-Higgs mechanism.',
    fullText: 'The discovery confirmed the existence of the scalar field giving mass to gauge bosons, recognized with the 2013 Nobel Prize in Physics awarded to Francois Englert and Peter Higgs.',
    pageCount: 29,
    charCount: 54000,
    fileSize: 1200000,
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 【分野8】気候科学・統計力学・新元素科学
  // ==========================================
  {
    id: 'sample_climate_manabe',
    fileName: 'manabe_radiative_convective_equilibrium_climate_change.pdf',
    title: 'Thermal Equilibrium of the Atmosphere with a Given Distribution of Relative Humidity and Greenhouse Climate Sensitivity',
    abstract: 'We construct a radiative-convective one-dimensional climate model incorporating absorption and emission by carbon dioxide, water vapor, and ozone, alongside convective vertical heat transport. The model demonstrates that doubling atmospheric CO2 concentration raises the equilibrium surface temperature by approximately 2.3 degrees Celsius.',
    fullText: 'Syukuro Manabe and Klaus Hasselmann were awarded the 2021 Nobel Prize in Physics for the physical modeling of Earth s climate, quantifying variability, and reliably predicting global warming.',
    pageCount: 22,
    charCount: 44000,
    fileSize: 890000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_physics_maxwell_demon',
    fileName: 'experimental_observation_mutual_information_maxwell_demon.pdf',
    title: 'Experimental Observation of the Role of Mutual Information in the Nonequilibrium Dynamics of a Maxwell Demon',
    abstract: 'We experimentally demonstrate information-to-energy conversion using a submicron dielectric particle controlled by real-time feedback in a fluctuating fluid environment. By measuring the generalized Jarzynski equality that incorporates measurement error and mutual information, we quantitatively verify that a Maxwell demon can extract work from thermal fluctuations by consuming information.',
    fullText: 'The experiment realizes a microscopic Szilard engine and experimentally confirms Sagawa-Ueda nonequilibrium thermodynamic relations connecting information theory with statistical mechanics.',
    pageCount: 6,
    charCount: 14200,
    fileSize: 380000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_physics_nihonium',
    fileName: 'morita_et_al_experiment_on_element_113_nihonium.pdf',
    title: 'Experiment on the Synthesis of Element 113 in the Reaction 209Bi(70Zn, n)278113',
    abstract: 'We report the observation of an unambiguous alpha-decay chain starting from the superheavy nucleus of element 113 (Nihonium, Nh), produced in the complete fusion reaction of 209Bi with 70Zn at the RIKEN Linear Accelerator (RILAC). Three consecutive alpha-decays were detected and assigned based on genetic decay correlations with known daughter nuclides.',
    fullText: 'Kosuke Morita and the RIKEN heavy-ion research group utilized the gas-filled recoil separator GARIS to provide conclusive evidence for the discovery of the 113th element, officially named Nihonium (Nh).',
    pageCount: 11,
    charCount: 21500,
    fileSize: 490000,
    createdAt: new Date().toISOString(),
  },
];
