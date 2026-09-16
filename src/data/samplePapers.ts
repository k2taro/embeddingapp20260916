/**
 * デモ用サンプル学術論文データセット
 * 
 * ユーザーが手元にPDFファイルを持っていない場合でも、
 * ブラウザ上でのベクトル化・UMAP・クラスタリングの挙動を即座に確認できるように
 * 多様な学問領域（AI/NLP、コンピュータビジョン、バイオ・医療、量子コンピューティング）から
 * 抜粋した実際の学術論文抄録セットです。
 */

import { ExtractedPaper } from '../types';

export const SAMPLE_ACADEMIC_PAPERS: ExtractedPaper[] = [
  // --- 分野A: 自然言語処理 / LLM ---
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
    id: 'sample_nlp_3',
    fileName: 'retrieval_augmented_generation.pdf',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    abstract: 'Large pre-trained language models have been shown to store factual knowledge in their parameters. However, their ability to precisely access and manipulate knowledge is still limited. We build Retrieval-Augmented Generation (RAG) models where the parametric memory is a pre-trained seq2seq model and non-parametric memory is a dense vector index of Wikipedia.',
    fullText: 'We evaluate RAG on a wide range of knowledge-intensive tasks and set state-of-the-art results on open-domain question answering benchmarks.',
    pageCount: 14,
    charCount: 26500,
    fileSize: 480000,
    createdAt: new Date().toISOString(),
  },

  // --- 分野B: コンピュータビジョン / 医療画像解析 ---
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

  // --- 分野C: バイオインフォマティクス / 創薬 / ゲノミクス ---
  {
    id: 'sample_bio_1',
    fileName: 'alphafold_protein_structure_prediction.pdf',
    title: 'Highly Accurate Protein Structure Prediction with AlphaFold',
    abstract: 'Proteins are essential to life, and understanding their structure can facilitate a mechanistic understanding of their function. Decades of effort have produced powerful experimental techniques, but resolving structures remains challenging. We present computational methods to predict 3D protein structures with atomic accuracy.',
    fullText: 'AlphaFold demonstrates accuracy competitive with experimental structures in the critical assessment of protein structure prediction (CASP14).',
    pageCount: 16,
    charCount: 33000,
    fileSize: 640000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_bio_2',
    fileName: 'crispr_cas9_genome_editing.pdf',
    title: 'CRISPR-Cas9 System for Targeted Genome Engineering and Gene Regulation',
    abstract: 'Targeted genome editing in eukaryotic cells has revolutionized molecular biology. The CRISPR-Cas9 endonuclease from Streptococcus pyogenes can be programmed by single-guide RNAs to generate site-specific double-strand breaks in DNA, enabling precise genomic alterations.',
    fullText: 'We discuss optimizations for off-target reduction, base editing, prime editing, and therapeutic delivery strategies for treating human genetic disorders.',
    pageCount: 12,
    charCount: 24000,
    fileSize: 450000,
    createdAt: new Date().toISOString(),
  },

  // --- 分野D: 量子コンピューティング / 物理シミュレーション ---
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

  // --- 分野E: 記念碑的物理学・新元素・情報統計力学 ---
  {
    id: 'sample_physics_nihonium',
    fileName: 'morita_et_al_experiment_on_element_113_nihonium.pdf',
    title: 'Experiment on the Synthesis of Element 113 in the Reaction 209Bi(70Zn, n)278113',
    abstract: 'We report the observation of an unambiguous alpha-decay chain starting from the superheavy nucleus of element 113 (Nihonium, Nh), produced in the complete fusion reaction of 209Bi with 70Zn at the RIKEN Linear Accelerator (RILAC). Three consecutive alpha-decays following the implantation of 278113 into a position-sensitive semiconductor detector were clearly detected and assigned based on genetic decay correlations with known daughter nuclides 274111 and 270Bh.',
    fullText: 'Kosuke Morita and the RIKEN heavy-ion research group utilized the gas-filled recoil separator GARIS. The observation of subsequent spontaneous fission and alpha decays provided conclusive evidence for the discovery of the 113th element, subsequently officially named Nihonium (Nh).',
    pageCount: 11,
    charCount: 21500,
    fileSize: 490000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_physics_higgs',
    fileName: 'observation_of_higgs_boson_atlas_cms.pdf',
    title: 'Observation of a New Boson at a Mass of 125 GeV with the ATLAS and CMS Experiments at the LHC',
    abstract: 'A search for the Standard Model Higgs boson is presented using proton-proton collision data recorded by the ATLAS and CMS detectors at the CERN Large Hadron Collider (LHC). An excess of events is observed with high statistical significance in the diphoton invariant mass spectrum and the four-lepton decay channel, corresponding to the discovery of a neutral scalar boson with a mass near 125 GeV, confirming the Brout-Englert-Higgs mechanism of electroweak symmetry breaking.',
    fullText: 'The discovery of the Higgs boson represents a historic milestone in fundamental particle physics. The combined local significance exceeds 5 standard deviations (5 sigma), establishing the existence of a spin-0 resonance consistent with the quantum of the Higgs scalar field responsible for generating masses of elementary particles.',
    pageCount: 29,
    charCount: 54000,
    fileSize: 1200000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_physics_maxwell_demon',
    fileName: 'experimental_observation_mutual_information_maxwell_demon.pdf',
    title: 'Experimental Observation of the Role of Mutual Information in the Nonequilibrium Dynamics of a Maxwell Demon',
    abstract: 'We experimentally demonstrate information-to-energy conversion using a submicron dielectric particle controlled by real-time feedback in a fluctuating fluid environment. By measuring the generalized Jarzynski equality that incorporates measurement error and mutual information, we quantitatively verify that a Maxwell demon can extract work from thermal fluctuations beyond the conventional second law of thermodynamics by consuming mutual information obtained through observation.',
    fullText: 'The experiment realizes a microscopic Szilard engine and experimentally confirms Sagawa-Ueda nonequilibrium thermodynamic relations. The feedback protocol applies electric potential barriers based on optical tracking, demonstrating that information acquired by the observer directly converts thermal energy into mechanical work.',
    pageCount: 6,
    charCount: 14200,
    fileSize: 380000,
    createdAt: new Date().toISOString(),
  },

  // --- 分野F: 再生医療・幹細胞生物学 ---
  {
    id: 'sample_stemcell_ips',
    fileName: 'induction_of_pluripotent_stem_cells_yamanaka.pdf',
    title: 'Induction of Pluripotent Stem Cells from Mouse and Human Fibroblasts by Defined Factors',
    abstract: 'Differentiated cells can be reprogrammed to an embryonic-like pluripotent state by the ectopic expression of four defined transcription factors: Oct3/4, Sox2, Klf4, and c-Myc (the Yamanaka factors). These induced pluripotent stem (iPS) cells exhibit the morphology, gene expression profile, epigenetic status, and pluripotency characteristic of embryonic stem cells, including the capability to differentiate into cell types of all three germ layers.',
    fullText: 'Kazutoshi Takahashi and Shinya Yamanaka demonstrated that cellular lineage differentiation is fully reversible without somatic nuclear transfer or unfertilized oocytes. The establishment of human iPS cells opens unprecedented avenues for regenerative medicine, drug discovery, disease modeling, and ethical patient-specific cell replacement therapies.',
    pageCount: 18,
    charCount: 36500,
    fileSize: 760000,
    createdAt: new Date().toISOString(),
  },

  // --- 分野G: 次世代エネルギー・材料化学 ---
  {
    id: 'sample_energy_perovskite',
    fileName: 'organometal_halide_perovskite_solar_cells_kojima_miyashita.pdf',
    title: 'Organometal Halide Perovskites as Visible-Light Sensitizers for Photovoltaic Energy Conversion',
    abstract: 'Organometal lead halide perovskite semiconductors (CH3NH3PbI3 and CH3NH3PbBr3) function as efficient visible-light absorbers in dye-sensitized liquid and solid-state solar cells. Their direct bandgap, high absorption coefficient across the solar spectrum, exceptional charge-carrier mobility, and long carrier diffusion lengths have propelled perovskite solar cells to groundbreaking power conversion efficiencies through rapid material engineering and roll-to-roll printable coating processes.',
    fullText: 'Originating from the pioneering research by Akihiro Kojima and Tsutomu Miyasaka, perovskite photovoltaics has emerged as the most rapidly advancing solar cell technology in history, bridging low manufacturing costs with efficiencies rivaling traditional crystalline silicon photovoltaics.',
    pageCount: 12,
    charCount: 23800,
    fileSize: 495000,
    createdAt: new Date().toISOString(),
  },
];
